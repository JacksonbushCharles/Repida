import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const socialProviders =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

export const auth =
  db && process.env.BETTER_AUTH_SECRET
    ? betterAuth({
        appName: "Repida",
        baseURL: process.env.BETTER_AUTH_URL,
        basePath: "/api/auth",
        secret: process.env.BETTER_AUTH_SECRET,
        database: drizzleAdapter(db, { provider: "pg", schema }),
        emailAndPassword: { enabled: true },
        socialProviders,
        advanced: {
          database: {
            generateId: "uuid",
          },
        },
        session: {
          expiresIn: 60 * 60 * 24 * 7,
          updateAge: 60 * 60 * 24,
        },
        trustedOrigins: [
          process.env.BETTER_AUTH_URL,
          process.env.NEXT_PUBLIC_APP_URL,
        ].filter((origin): origin is string => Boolean(origin)),
      })
    : null;
