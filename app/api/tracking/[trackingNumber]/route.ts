import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { shipment, trackingEvent } from "@/lib/db/schema";

export async function GET(
  _request: Request,
  context: { params: Promise<{ trackingNumber: string }> },
) {
  const { trackingNumber } = await context.params;

  if (!db) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  const normalizedTrackingNumber = trackingNumber.trim().toUpperCase();
  const rows = await db
    .select({
      id: shipment.id,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      serviceLevel: shipment.serviceLevel,
      originCity: shipment.originCity,
      originCountry: shipment.originCountry,
      destinationCity: shipment.destinationCity,
      destinationCountry: shipment.destinationCountry,
      estimatedDelivery: shipment.estimatedDelivery,
      createdAt: shipment.createdAt,
    })
    .from(shipment)
    .where(eq(shipment.trackingNumber, normalizedTrackingNumber))
    .limit(1);
  const item = rows[0] ?? null;
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

  return NextResponse.json({
    ok: true,
    mode: "database",
    shipment: { ...item, events },
    events,
  });
}