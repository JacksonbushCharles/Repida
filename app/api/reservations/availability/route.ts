import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "2026-12-01";
  const partySize = Number(searchParams.get("partySize") ?? "2");

  return NextResponse.json({
    date,
    partySize,
    slots: ["18:00", "18:30", "19:00", "19:30"],
  });
}
