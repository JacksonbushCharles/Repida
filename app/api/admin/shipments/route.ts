import { randomBytes } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAdminAccess, requireAdminApi } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { shipment, shipmentStatusHistory, trackingEvent, user } from "@/lib/db/schema";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
    return NextResponse.json({ ok: false, error: "Shipment details are required." }, { status: 400 });
  }

  const customerId = readText(body.customerId);
  const originCity = readText(body.originCity);
  const originCountry = readText(body.originCountry);
  const destinationCity = readText(body.destinationCity);
  const destinationCountry = readText(body.destinationCountry);
  const recipientName = readText(body.recipientName);
  const recipientPhone = readText(body.recipientPhone);
  const deliveryAddress = readText(body.deliveryAddress);
  const serviceLevel = readText(body.serviceLevel);
  const declaredValue = body.declaredValue === "" ? 0 : Number(body.declaredValue);
  const shippingCost = body.shippingCost === "" ? 0 : Number(body.shippingCost);
  const estimatedDelivery =
    typeof body.estimatedDelivery === "string" && body.estimatedDelivery
      ? new Date(body.estimatedDelivery)
      : null;

  if (
    (customerId !== "" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(customerId)) ||
    !originCity ||
    !originCountry ||
    !destinationCity ||
    !destinationCountry ||
    !recipientName ||
    !recipientPhone ||
    !deliveryAddress ||
    !serviceLevel ||
    [originCity, originCountry, destinationCity, destinationCountry].some((value) => value.length > 100) ||
    recipientName.length > 100 ||
    recipientPhone.length > 30 ||
    deliveryAddress.length > 250 ||
    serviceLevel.length > 60 ||
    !/^[+()\d.\-\s]{6,30}$/.test(recipientPhone) ||
    !["STANDARD", "EXPRESS", "AIR_FREIGHT", "SEA_FREIGHT", "ROAD"].includes(serviceLevel)
  ) {
    return NextResponse.json(
      { ok: false, error: "Provide valid recipient, origin, destination, and service details." },
      { status: 400 },
    );
  }
  if (
    !Number.isSafeInteger(declaredValue) ||
    declaredValue < 0 ||
    !Number.isSafeInteger(shippingCost) ||
    shippingCost < 0 ||
    (estimatedDelivery && Number.isNaN(estimatedDelivery.getTime()))
  ) {
    return NextResponse.json(
      { ok: false, error: "Declared value, shipping cost, or estimated delivery date is invalid." },
      { status: 400 },
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (customerId) {
    const [customer] = await db
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.id, customerId), sql`lower(${user.email}) <> ${adminEmail}`))
      .limit(1);
    if (!customer) {
      return NextResponse.json({ ok: false, error: "Selected customer was not found." }, { status: 404 });
    }
  }

  const trackingNumber = `RPD-${randomBytes(8).toString("hex").toUpperCase()}`;
  const admin = await getAdminAccess(request.headers);
  const created = await db.transaction(async (tx) => {
    const [newShipment] = await tx
      .insert(shipment)
      .values({
        trackingNumber,
        customerId: customerId || null,
        status: "PENDING",
        serviceLevel,
        originCity,
        originCountry,
        destinationCity,
        destinationCountry,
        recipientName,
        recipientPhone,
        deliveryAddress,
        estimatedDelivery,
        declaredValue,
        shippingCost,
      })
      .returning();

    await tx.insert(shipmentStatusHistory).values({
      shipmentId: newShipment.id,
      newStatus: "PENDING",
      reason: "Shipment created",
      actorId: admin.authorized ? admin.userId : null,
    });
    await tx.insert(trackingEvent).values({
      shipmentId: newShipment.id,
      eventType: "Shipment created",
      location: `${originCity}, ${originCountry}`,
      details: `Shipment is pending dispatch via ${serviceLevel}.`,
      checkpointStatus: "CURRENT",
    });
    return newShipment;
  });

  return NextResponse.json({ ok: true, shipment: created }, { status: 201 });
}
