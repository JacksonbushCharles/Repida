import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const fallback = {
  GET: async () =>
    NextResponse.json(
      {
        ok: false,
        error: "Authentication backend is not configured. Add DATABASE_URL and BETTER_AUTH_SECRET to continue.",
      },
      { status: 503 },
    ),
  POST: async () =>
    NextResponse.json(
      {
        ok: false,
        error: "Authentication backend is not configured. Add DATABASE_URL and BETTER_AUTH_SECRET to continue.",
      },
      { status: 503 },
    ),
};

const handlers = !auth
  ? fallback
  : toNextJsHandler(auth);

export const { GET, POST } = handlers;