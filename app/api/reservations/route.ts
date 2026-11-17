import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ reservations: [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    reference: `REP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: "pending",
    startsAt: body.time ?? "18:00",
  });
}
