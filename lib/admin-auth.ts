import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type AdminAccess =
  | { authorized: true; userId: string }
  | { authorized: false; reason: "unconfigured" | "unauthenticated" | "forbidden" };

export async function getAdminAccess(requestHeaders?: Headers): Promise<AdminAccess> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!auth || !adminEmail) {
    return { authorized: false, reason: "unconfigured" };
  }

  const session = await auth.api.getSession({
    headers: requestHeaders ?? await headers(),
  });
  if (!session) {
    return { authorized: false, reason: "unauthenticated" };
  }

  if (
    session.user.email.trim().toLowerCase() !== adminEmail ||
    !session.user.emailVerified
  ) {
    return { authorized: false, reason: "forbidden" };
  }

  return { authorized: true, userId: session.user.id };
}

export async function requireAdminApi(request: Request) {
  const access = await getAdminAccess(request.headers);
  if (access.authorized) {
    return null;
  }

  const status =
    access.reason === "unconfigured"
      ? 503
      : access.reason === "unauthenticated"
        ? 401
        : 403;
  const message =
    access.reason === "unconfigured"
      ? "Admin authentication is not configured."
      : access.reason === "unauthenticated"
        ? "Sign in to access this resource."
        : "Admin access is required.";

  return NextResponse.json({ ok: false, error: message }, { status });
}
