import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAdminAccess, requireAdminApi } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { shipment, shipmentStatusHistory, trackingEvent } from "@/lib/db/schema";

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
  const status =
    isRecord(body) && typeof body.status === "string"
      ? body.status.toUpperCase()
      : "";
  if (!shipmentStatuses.includes(status as (typeof shipmentStatuses)[number])) {
    return NextResponse.json({ ok: false, error: "Choose a valid shipment status." }, { status: 400 });
  }

  const { id } = await context.params;
  const admin = await getAdminAccess(request.headers);
  const updated = await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(shipment).where(eq(shipment.id, id)).limit(1);
    if (!existing) return null;
    if (existing.status.toUpperCase() === status) return existing;

    const [saved] = await tx
      .update(shipment)
      .set({ status, updatedAt: new Date() })
      .where(eq(shipment.id, id))
      .returning();
    const eventType = status.replaceAll("_", " ");
    await tx
      .update(trackingEvent)
      .set({ checkpointStatus: "COMPLETED" })
      .where(
        and(
          eq(trackingEvent.shipmentId, id),
          eq(trackingEvent.checkpointStatus, "CURRENT"),
        ),
      );
    await tx.insert(shipmentStatusHistory).values({
      shipmentId: id,
      previousStatus: existing.status,
      newStatus: status,
      reason: `Status changed to ${eventType.toLowerCase()}`,
      actorId: admin.authorized ? admin.userId : null,
    });
    await tx.insert(trackingEvent).values({
      shipmentId: id,
      eventType,
      location: null,
      details: `Shipment status updated to ${eventType.toLowerCase()}.`,
      checkpointStatus: "CURRENT",
    });
    return saved;
  });

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Shipment was not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, shipment: updated });
}
