import { and, eq } from "drizzle-orm";
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

export async function GET(request: Request) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;
  if (!db) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  const trackingNumber = new URL(request.url).searchParams.get("trackingNumber")?.trim().toUpperCase();
  if (!trackingNumber) {
    return NextResponse.json({ ok: false, error: "Enter a tracking number." }, { status: 400 });
  }

  const [item] = await db
    .select({
      id: shipment.id,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
    })
    .from(shipment)
    .where(eq(shipment.trackingNumber, trackingNumber))
    .limit(1);
  if (!item) {
    return NextResponse.json({ ok: false, error: "No shipment was found for that tracking number." }, { status: 404 });
  }

  const events = await db
    .select({
      id: trackingEvent.id,
      eventType: trackingEvent.eventType,
      location: trackingEvent.location,
      details: trackingEvent.details,
      checkpointStatus: trackingEvent.checkpointStatus,
      eventAt: trackingEvent.eventAt,
    })
    .from(trackingEvent)
    .where(eq(trackingEvent.shipmentId, item.id))
    .orderBy(trackingEvent.eventAt, trackingEvent.createdAt);

  return NextResponse.json({ ok: true, shipment: item, events });
}

export async function POST(request: Request) {
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

  const trackingNumber = text(body.trackingNumber, 64).toUpperCase();
  const eventType = text(body.eventType, 100);
  const location = text(body.location, 160);
  const details = text(body.details, 500);
  const checkpointStatus = text(body.checkpointStatus, 20).toUpperCase();
  const status = text(body.shipmentStatus, 30).toUpperCase();
  const eventAt = typeof body.eventAt === "string" ? new Date(body.eventAt) : null;

  if (
    !trackingNumber ||
    !eventType ||
    eventType.length > 100 ||
    location.length > 160 ||
    details.length > 500 ||
    !checkpointStatuses.includes(checkpointStatus as (typeof checkpointStatuses)[number]) ||
    (eventAt && Number.isNaN(eventAt.getTime())) ||
    (checkpointStatus === "UPCOMING" && !eventAt) ||
    (checkpointStatus === "CURRENT" && !shipmentStatuses.includes(status as (typeof shipmentStatuses)[number]))
  ) {
    return NextResponse.json({ ok: false, error: "Provide a title, valid checkpoint status, and valid event details." }, { status: 400 });
  }
  if (checkpointStatus === "UPCOMING" && eventAt && eventAt.getTime() < Date.now()) {
    return NextResponse.json({ ok: false, error: "An upcoming checkpoint must have a future date and time." }, { status: 400 });
  }

  const [item] = await db
    .select({ id: shipment.id, status: shipment.status })
    .from(shipment)
    .where(eq(shipment.trackingNumber, trackingNumber))
    .limit(1);
  if (!item) {
    return NextResponse.json({ ok: false, error: "No shipment was found for that tracking number." }, { status: 404 });
  }

  const admin = await getAdminAccess(request.headers);
  const created = await db.transaction(async (tx) => {
    if (checkpointStatus === "CURRENT") {
      await tx
        .update(trackingEvent)
        .set({ checkpointStatus: "COMPLETED" })
        .where(
          and(
            eq(trackingEvent.shipmentId, item.id),
            eq(trackingEvent.checkpointStatus, "CURRENT"),
          ),
        );
    }

    const [event] = await tx
      .insert(trackingEvent)
      .values({
        shipmentId: item.id,
        eventType,
        location: location || null,
        details: details || null,
        checkpointStatus,
        eventAt: eventAt ?? new Date(),
      })
      .returning();

    if (checkpointStatus === "CURRENT") {
      await tx
        .update(shipment)
        .set({ status, updatedAt: new Date() })
        .where(eq(shipment.id, item.id));
      await tx.insert(shipmentStatusHistory).values({
        shipmentId: item.id,
        previousStatus: item.status,
        newStatus: status,
        reason: `Timeline updated: ${eventType}`,
        actorId: admin.authorized ? admin.userId : null,
      });
    }
    return event;
  });

  return NextResponse.json({ ok: true, event: created }, { status: 201 });
}
