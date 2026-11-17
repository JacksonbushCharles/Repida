import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAdminAccess, requireAdminApi } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { shipment, shipmentStatusHistory, trackingEvent } from "@/lib/db/schema";

const checkpointStatuses = ["COMPLETED", "CURRENT", "UPCOMING"] as const;
const shipmentStatuses = [
  "PENDING",
  "PROCESSING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "CANCELLED",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;
  if (!db) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ ok: false, error: "Checkpoint details are required." }, { status: 400 });
  }

  const eventType = text(body.eventType, 100);
  const location = text(body.location, 160);
  const details = text(body.details, 500);
  const checkpointStatus = text(body.checkpointStatus, 20).toUpperCase();
  const status = text(body.shipmentStatus, 30).toUpperCase();
  const eventAt = typeof body.eventAt === "string" ? new Date(body.eventAt) : null;
  if (
    !eventType ||
    eventType.length > 100 ||
    location.length > 160 ||
    details.length > 500 ||
    !checkpointStatuses.includes(checkpointStatus as (typeof checkpointStatuses)[number]) ||
    !eventAt ||
    Number.isNaN(eventAt.getTime()) ||
    (checkpointStatus === "CURRENT" && !shipmentStatuses.includes(status as (typeof shipmentStatuses)[number]))
  ) {
    return NextResponse.json({ ok: false, error: "Provide a title, valid checkpoint status, and valid event date." }, { status: 400 });
  }
  if (checkpointStatus === "UPCOMING" && eventAt.getTime() < Date.now()) {
    return NextResponse.json({ ok: false, error: "An upcoming checkpoint must have a future date and time." }, { status: 400 });
  }

  const { id } = await context.params;
  const [existing] = await db
    .select()
    .from(trackingEvent)
    .where(eq(trackingEvent.id, id))
    .limit(1);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Timeline checkpoint was not found." }, { status: 404 });
  }

  const admin = await getAdminAccess(request.headers);
  const updated = await db.transaction(async (tx) => {
    if (checkpointStatus === "CURRENT") {
      await tx
        .update(trackingEvent)
        .set({ checkpointStatus: "COMPLETED" })
        .where(eq(trackingEvent.shipmentId, existing.shipmentId));
    }

    const [event] = await tx
      .update(trackingEvent)
      .set({
        eventType,
        location: location || null,
        details: details || null,
        checkpointStatus,
        eventAt,
      })
      .where(eq(trackingEvent.id, id))
      .returning();

    if (checkpointStatus === "CURRENT") {
      const [currentShipment] = await tx
        .select({ status: shipment.status })
        .from(shipment)
        .where(eq(shipment.id, existing.shipmentId))
        .limit(1);
      if (currentShipment && currentShipment.status !== status) {
        await tx
          .update(shipment)
          .set({ status, updatedAt: new Date() })
          .where(eq(shipment.id, existing.shipmentId));
        await tx.insert(shipmentStatusHistory).values({
          shipmentId: existing.shipmentId,
          previousStatus: currentShipment.status,
          newStatus: status,
          reason: `Timeline updated: ${eventType}`,
          actorId: admin.authorized ? admin.userId : null,
        });
      }
    }
    return event;
  });

  return NextResponse.json({ ok: true, event: updated });
}
