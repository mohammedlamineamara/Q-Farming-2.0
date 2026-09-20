/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getTableConfig } from "drizzle-orm/mysql-core";
import * as schema from "../../db/schema";
import { getDb, _resetDbInstance, _setDbInitializer } from "../queries/connection";
import { env } from "../lib/env";

describe("Database Schema Hardening (Phase 4C)", () => {
  it("exports users.email unique index and preserves nullable email", () => {
    const usersConfig = getTableConfig(schema.users as any);
    const emailIndex = usersConfig.indexes.find(
      (idx) => idx.config.name === "users_email_unique"
    );

    expect(emailIndex).toBeDefined();
    expect(emailIndex?.config.unique).toBe(true);
    // Preserves nullable behavior so non-email auth or migration paths are not broken
    expect(schema.users.email.notNull).toBe(false);
  });

  it("exports tenant performance indexes across all user-scoped tables", () => {
    const expectedIndexes: Record<string, { table: any; indexName: string }> = {
      fields: { table: schema.fields, indexName: "fields_user_id_idx" },
      workers: { table: schema.workers, indexName: "workers_user_id_idx" },
      inventoryItems: { table: schema.inventoryItems, indexName: "inventory_items_user_id_idx" },
      sensors: { table: schema.sensors, indexName: "sensors_user_field_idx" },
      calendarEvents: { table: schema.calendarEvents, indexName: "calendar_events_user_date_idx" },
      activities: { table: schema.activities, indexName: "activities_user_created_idx" },
      notifications: { table: schema.notifications, indexName: "notifications_user_read_idx" },
      harvests: { table: schema.harvests, indexName: "harvests_user_field_idx" },
      sales: { table: schema.sales, indexName: "sales_user_harvest_idx" },
      aiInsights: { table: schema.aiInsights, indexName: "ai_insights_user_cat_idx" },
    };

    for (const [key, { table, indexName }] of Object.entries(expectedIndexes)) {
      const config = getTableConfig(table as any);
      const found = config.indexes.some((idx) => idx.config.name === indexName);
      expect(found, `Table ${key} should have index ${indexName}`).toBe(true);
    }
  });

  it("enforces 1:1 user settings uniqueness", () => {
    expect((schema.settings.userId as any).isUnique).toBe(true);
  });

  it("supports Phase 4 Option B authProvider enum and nullable password", () => {
    expect(schema.users.password.notNull).toBe(false);
    expect(schema.users.authProvider).toBeDefined();
    expect(schema.users.authProvider.notNull).toBe(true);
    expect(schema.users.authProvider.default).toBe("local");
    expect(schema.users.authProvider.enumValues).toEqual(["local", "kimi"]);
  });
});

describe("Database Connection Safety (Phase 4C)", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = env.databaseUrl;

  beforeEach(() => {
    _resetDbInstance();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    env.databaseUrl = originalDatabaseUrl;
    _resetDbInstance();
    vi.restoreAllMocks();
  });

  it("fails fast in production when DATABASE_URL is missing", () => {
    process.env.NODE_ENV = "production";
    env.databaseUrl = "";

    expect(() => getDb()).toThrow("Production database is not configured");
  });

  it("fails explicitly without leaking credentials when production DB initialization fails", () => {
    process.env.NODE_ENV = "production";
    env.databaseUrl = "mysql://admin:SUPER_SECRET_PW@invalid-domain.com:3306/db";

    _setDbInitializer(() => {
      throw new Error("Driver error with mysql://admin:SUPER_SECRET_PW@invalid-domain.com:3306/db");
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => getDb()).toThrow("Failed to initialize production database");

    // Ensure credentials were not leaked to console.error
    for (const call of consoleErrorSpy.mock.calls) {
      const logged = call.join(" ");
      expect(logged).not.toContain("SUPER_SECRET_PW");
    }
  });

  it("uses mock database in development when DATABASE_URL is not set", () => {
    process.env.NODE_ENV = "development";
    env.databaseUrl = "";

    const db = getDb();
    expect(db).toBeDefined();
    // Querying mock DB should resolve smoothly without throwing
    expect(typeof db.select).toBe("function");
  });
});
