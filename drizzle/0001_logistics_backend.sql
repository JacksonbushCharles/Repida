CREATE TABLE IF NOT EXISTS "user" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "image" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "purpose" TEXT NOT NULL DEFAULT 'verification'
);

CREATE TABLE IF NOT EXISTS "customer_profile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
  "accountType" TEXT NOT NULL DEFAULT 'CUSTOMER',
  "companyName" TEXT,
  "phone" TEXT,
  "timezone" TEXT DEFAULT 'UTC',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "admin_profile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
  "permissions" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "shipment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "trackingNumber" TEXT NOT NULL UNIQUE,
  "customerId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "serviceLevel" TEXT NOT NULL DEFAULT 'STANDARD',
  "originCountry" TEXT NOT NULL,
  "destinationCountry" TEXT NOT NULL,
  "originCity" TEXT,
  "destinationCity" TEXT,
  "declaredValue" INTEGER DEFAULT 0,
  "shippingCost" INTEGER DEFAULT 0,
  "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
  "routeId" UUID,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "route" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
  "metadata" JSONB DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "route_stop" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "routeId" UUID NOT NULL REFERENCES "route"("id") ON DELETE CASCADE,
  "locationName" TEXT NOT NULL,
  "country" TEXT,
  "city" TEXT,
  "sequence" INTEGER NOT NULL,
  "expectedArrival" TIMESTAMPTZ,
  "expectedDeparture" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "shipment_status_history" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "shipmentId" UUID NOT NULL REFERENCES "shipment"("id") ON DELETE CASCADE,
  "previousStatus" TEXT,
  "newStatus" TEXT NOT NULL,
  "reason" TEXT,
  "actorId" UUID REFERENCES "user"("id"),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "tracking_event" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "shipmentId" UUID NOT NULL REFERENCES "shipment"("id") ON DELETE CASCADE,
  "eventType" TEXT NOT NULL,
  "location" TEXT,
  "details" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "payment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "shipmentId" UUID NOT NULL REFERENCES "shipment"("id") ON DELETE CASCADE,
  "customerId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "paymentProvider" TEXT NOT NULL DEFAULT 'paystack',
  "providerReference" TEXT,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "support_ticket" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customerId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "shipmentId" UUID REFERENCES "shipment"("id") ON DELETE SET NULL,
  "category" TEXT NOT NULL DEFAULT 'GENERAL',
  "subject" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ticket_message" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "ticketId" UUID NOT NULL REFERENCES "support_ticket"("id") ON DELETE CASCADE,
  "senderId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "isInternal" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "notification" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "metadata" JSONB DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "shipment_tracking_number_idx" ON "shipment" ("trackingNumber");
CREATE INDEX IF NOT EXISTS "shipment_customer_idx" ON "shipment" ("customerId");
CREATE INDEX IF NOT EXISTS "shipment_status_idx" ON "shipment" ("status");
CREATE INDEX IF NOT EXISTS "route_stop_route_idx" ON "route_stop" ("routeId", "sequence");
CREATE INDEX IF NOT EXISTS "support_ticket_customer_idx" ON "support_ticket" ("customerId");
CREATE INDEX IF NOT EXISTS "notification_user_idx" ON "notification" ("userId", "createdAt");
