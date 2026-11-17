import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  return NextResponse.json({
    hours: [
      { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
      { dayOfWeek: 1, openTime: "08:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 2, openTime: "08:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 3, openTime: "08:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 4, openTime: "08:00", closeTime: "18:00", isClosed: false },
      { dayOfWeek: 5, openTime: "09:00", closeTime: "19:00", isClosed: false },
      { dayOfWeek: 6, openTime: "10:00", closeTime: "15:00", isClosed: false },
    ],
  });
}

export async function PUT(request: Request) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body });
}
