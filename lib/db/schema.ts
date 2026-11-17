import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  purpose: text("purpose").notNull().default("verification"),
});

export const customerProfile = pgTable("customer_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  accountType: text("accountType").notNull().default("CUSTOMER"),
  companyName: text("companyName"),
  phone: text("phone"),
  timezone: text("timezone").default("UTC"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const adminProfile = pgTable("admin_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("SUPER_ADMIN"),
  permissions: jsonb("permissions").notNull().default([]),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const shipment = pgTable("shipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackingNumber: text("trackingNumber").notNull().unique(),
  customerId: uuid("customerId").references(() => user.id, { onDelete: "set null" }),
  status: text("status").notNull().default("DRAFT"),
  serviceLevel: text("serviceLevel").notNull().default("STANDARD"),
  originCountry: text("originCountry").notNull(),
  destinationCountry: text("destinationCountry").notNull(),
  originCity: text("originCity"),
  destinationCity: text("destinationCity"),
  recipientName: text("recipientName").notNull(),
  recipientPhone: text("recipientPhone").notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  estimatedDelivery: timestamp("estimatedDelivery", { withTimezone: true }),
  declaredValue: integer("declaredValue").default(0),
  shippingCost: integer("shippingCost").default(0),
  paymentStatus: text("paymentStatus").notNull().default("UNPAID"),
  routeId: uuid("routeId"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const route = pgTable("route", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  isActive: boolean("isActive").notNull().default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const routeStop = pgTable("route_stop", {
  id: uuid("id").primaryKey().defaultRandom(),
  routeId: uuid("routeId").notNull().references(() => route.id, { onDelete: "cascade" }),
  locationName: text("locationName").notNull(),
  country: text("country"),
  city: text("city"),
  sequence: integer("sequence").notNull(),
  expectedArrival: timestamp("expectedArrival", { withTimezone: true }),
  expectedDeparture: timestamp("expectedDeparture", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const shipmentStatusHistory = pgTable("shipment_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  shipmentId: uuid("shipmentId").notNull().references(() => shipment.id, { onDelete: "cascade" }),
  previousStatus: text("previousStatus"),
  newStatus: text("newStatus").notNull(),
  reason: text("reason"),
  actorId: uuid("actorId").references(() => user.id),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const trackingEvent = pgTable("tracking_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  shipmentId: uuid("shipmentId").notNull().references(() => shipment.id, { onDelete: "cascade" }),
  eventType: text("eventType").notNull(),
  location: text("location"),
  details: text("details"),
  checkpointStatus: text("checkpointStatus").notNull().default("COMPLETED"),
  eventAt: timestamp("eventAt", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const payment = pgTable("payment", {
  id: uuid("id").primaryKey().defaultRandom(),
  shipmentId: uuid("shipmentId").notNull().references(() => shipment.id, { onDelete: "cascade" }),
  customerId: uuid("customerId").notNull().references(() => user.id, { onDelete: "cascade" }),
  paymentProvider: text("paymentProvider").notNull().default("paystack"),
  providerReference: text("providerReference"),
  amount: integer("amount").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("PENDING"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const supportTicket = pgTable("support_ticket", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customerId").notNull().references(() => user.id, { onDelete: "cascade" }),
  shipmentId: uuid("shipmentId").references(() => shipment.id, { onDelete: "set null" }),
  category: text("category").notNull().default("GENERAL"),
  subject: text("subject").notNull(),
  priority: text("priority").notNull().default("NORMAL"),
  status: text("status").notNull().default("OPEN"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const ticketMessage = pgTable("ticket_message", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticketId").notNull().references(() => supportTicket.id, { onDelete: "cascade" }),
  senderId: uuid("senderId").notNull().references(() => user.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isInternal: boolean("isInternal").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const notification = pgTable("notification", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  isRead: boolean("isRead").notNull().default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  customerProfile,
  adminProfile,
  shipment,
  route,
  routeStop,
  shipmentStatusHistory,
  trackingEvent,
  payment,
  supportTicket,
  ticketMessage,
  notification,
};
