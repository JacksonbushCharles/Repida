import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const { id } = await context.params;
  return NextResponse.json({ id, status: "pending" });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi(request);
  if (denied) return denied;

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, id, status: body.status ?? "pending" });
}
