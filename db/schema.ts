import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

// ─── Users (Auth) ──────────────────────────────────────────────
export const users = mysqlTable("users", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  email: varchar("email", { length: 320 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", [
  "admin",
  "farm_manager",
  "agronomist",
  "worker"
  ]).default("worker").notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Farm Fields ───────────────────────────────────────────────
export const fields = mysqlTable("fields", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  crop: varchar("crop", { length: 100 }).notNull(),
  size: decimal("size", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["active", "irrigation", "harvest", "fallow"]).default("active").notNull(),
  progress: int("progress").default(0).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  lat: varchar("lat", { length: 50 }).notNull(),
  lng: varchar("lng", { length: 50 }).notNull(),
  moisture: int("moisture").default(0).notNull(),
  temp: int("temp").default(0).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Field = typeof fields.$inferSelect;
export type InsertField = typeof fields.$inferInsert;

// ─── Harvests / Production ────────────────────────────────────
export const harvests = mysqlTable("harvests", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  fieldId: bigint("fieldId", { mode: "number", unsigned: true })
    .notNull(),

  crop: varchar("crop", { length: 100 }).notNull(),

  quantity: decimal("quantity", { precision: 12, scale: 2 })
    .notNull(),

  unit: varchar("unit", { length: 20 })
    .default("tons")
    .notNull(),

  yieldPerHa: decimal("yieldPerHa", { precision: 10, scale: 2 })
    .notNull(),

  harvestedAt: timestamp("harvestedAt")
    .notNull(),

  notes: text("notes"),

  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),

  createdAt: timestamp("createdAt")
    .defaultNow()
    .notNull(),
});

export type Harvest = typeof harvests.$inferSelect;
export type InsertHarvest = typeof harvests.$inferInsert;

// ─── Sales / Revenue ──────────────────────────────────────────
export const sales = mysqlTable("sales", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  harvestId: bigint("harvestId", { mode: "number", unsigned: true }),

  crop: varchar("crop", { length: 100 })
    .notNull(),

  quantity: decimal("quantity", { precision: 12, scale: 2 })
    .notNull(),

  unit: varchar("unit", { length: 20 })
    .default("tons")
    .notNull(),

  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 })
    .notNull(),

  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 })
    .notNull(),

  currency: varchar("currency", { length: 10 })
    .default("DZD")
    .notNull(),

  soldAt: timestamp("soldAt")
    .notNull(),

  customer: varchar("customer", { length: 255 }),

  notes: text("notes"),

  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),

  createdAt: timestamp("createdAt")
    .defaultNow()
    .notNull(),
});

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

// ─── Inventory Items ───────────────────────────────────────────
export const inventoryItems = mysqlTable("inventory_items", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["seeds", "fertilizer", "equipment", "pesticide", "other"]).notNull(),
  stock: int("stock").default(0).notNull(),
  max: int("max").default(100).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).default("📦").notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = typeof inventoryItems.$inferInsert;

// ─── IoT Sensors ───────────────────────────────────────────────
export const sensors = mysqlTable("sensors", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  max: int("max").default(100).notNull(),
  status: mysqlEnum("status", ["optimal", "warning", "critical"]).default("optimal").notNull(),
  color: varchar("color", { length: 50 }).default("#10b981").notNull(),
  icon: varchar("icon", { length: 50 }).default("📡").notNull(),
  fieldId: bigint("fieldId", { mode: "number", unsigned: true }),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Sensor = typeof sensors.$inferSelect;
export type InsertSensor = typeof sensors.$inferInsert;

// ─── Workers ───────────────────────────────────────────────────
export const workers = mysqlTable("workers", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  role: varchar("role", { length: 255 }).notNull(),

  status: mysqlEnum("status", ["online", "offline", "busy"])
    .default("offline")
    .notNull(),

  avatar: varchar("avatar", { length: 50 })
    .default("👷")
    .notNull(),

  phone: varchar("phone", { length: 50 }),

  email: varchar("email", { length: 320 }),

  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),

  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Worker = typeof workers.$inferSelect;
export type InsertWorker = typeof workers.$inferInsert;

// ─── Activities ────────────────────────────────────────────────
export const activities = mysqlTable("activities", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 50 }).default("📋").notNull(),
  type: mysqlEnum("type", ["success", "warning", "danger", "info"]).default("info").notNull(),
  read: boolean("read").default(false).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

// ─── AI Insights ───────────────────────────────────────────────
export const aiInsights = mysqlTable("ai_insights", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  icon: varchar("icon", { length: 50 }).default("🤖").notNull(),
  confidence: int("confidence").default(90).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = typeof aiInsights.$inferInsert;

// ─── Calendar Events ───────────────────────────────────────────
export const calendarEvents = mysqlTable("calendar_events", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("eventDate").notNull(),
  fieldId: bigint("fieldId", { mode: "number", unsigned: true }),
  workerId: bigint("workerId", { mode: "number", unsigned: true }),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

// ─── Notifications ─────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).default("🔔").notNull(),
  read: boolean("read").default(false).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ─── Settings ──────────────────────────────────────────────────
export const settings = mysqlTable("settings", {
id: bigint("id", { mode: "number", unsigned: true })
  .autoincrement()
  .primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull().unique(),
  theme: mysqlEnum("theme", ["light", "dark"]).default("dark").notNull(),
  offlineMode: boolean("offlineMode").default(true).notNull(),
  autoSync: boolean("autoSync").default(true).notNull(),
  gpsTracking: boolean("gpsTracking").default(true).notNull(),
  aiNotifications: boolean("aiNotifications").default(true).notNull(),
  predictiveAnalytics: boolean("predictiveAnalytics").default(true).notNull(),
  farmLocation: varchar("farmLocation", { length: 255 }).default("Algiers, Algeria").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;
