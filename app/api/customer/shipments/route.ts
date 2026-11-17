import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { shipment } from "@/lib/db/schema";

export async function GET(request: Request) {
  if (!auth || !db) {
    return NextResponse.json(
      { ok: false, error: "Authentication or database is not configured." },
      { status: 503 },
    );
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sign in to view your shipments." }, { status: 401 });
  }

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
      recipientName: shipment.recipientName,
      recipientPhone: shipment.recipientPhone,
      deliveryAddress: shipment.deliveryAddress,
      estimatedDelivery: shipment.estimatedDelivery,
      paymentStatus: shipment.paymentStatus,
      createdAt: shipment.createdAt,
    })
    .from(shipment)
    .where(eq(shipment.customerId, session.user.id))
    .orderBy(desc(shipment.createdAt));

  const countByStatus = (statuses: string[]) =>
    rows.filter((item) => statuses.includes(item.status.toUpperCase())).length;

  return NextResponse.json({
    ok: true,
    metrics: {
      totalShipments: rows.length,
      pending: countByStatus(["DRAFT", "PENDING", "CREATED"]),
      processing: countByStatus(["PROCESSING", "PICKED_UP", "OUT_FOR_DELIVERY"]),
      inTransit: countByStatus(["IN_TRANSIT"]),
      delivered: countByStatus(["DELIVERED"]),
    },
    shipments: rows,
  });
}
