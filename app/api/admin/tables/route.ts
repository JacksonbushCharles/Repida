import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  return NextResponse.json({ tables: [] });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, table: body });
}
