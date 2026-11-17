import { count, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shipment, user } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  if (!db) {
    return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const customerFilter = sql`lower(${user.email}) <> ${adminEmail}`;
  const [customerCountRows, customers, shipmentStatusCounts, shipmentRows] = await Promise.all([
    db.select({ total: count() }).from(user).where(customerFilter),
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(customerFilter)
      .orderBy(desc(user.createdAt))
      .limit(100),
    db.select({ status: shipment.status, total: count() }).from(shipment).groupBy(shipment.status),
    db
      .select({
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        customerId: shipment.customerId,
        customerName: user.name,
        customerEmail: user.email,
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
        createdAt: shipment.createdAt,
      })
      .from(shipment)
      .leftJoin(user, sql`${shipment.customerId} = ${user.id}`)
      .orderBy(desc(shipment.createdAt))
      .limit(30),
  ]);

  const counts = new Map(
    shipmentStatusCounts.map((item) => [item.status.toUpperCase(), item.total]),
  );
  const sumStatuses = (statuses: string[]) =>
    statuses.reduce((total, status) => total + (counts.get(status) ?? 0), 0);

  return NextResponse.json({
    ok: true,
    mode: "database",
    metrics: {
      totalCustomers: customerCountRows[0]?.total ?? 0,
      totalShipments: sumStatuses([...counts.keys()]),
      pending: sumStatuses(["DRAFT", "PENDING", "CREATED"]),
      processing: sumStatuses(["PROCESSING", "PICKED_UP", "OUT_FOR_DELIVERY"]),
      inTransit: sumStatuses(["IN_TRANSIT"]),
      delivered: sumStatuses(["DELIVERED"]),
      delayed: sumStatuses(["DELAYED"]),
    },
    customers,
    shipments: shipmentRows,
  });
}