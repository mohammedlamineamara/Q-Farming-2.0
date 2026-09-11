/* eslint-disable @typescript-eslint/no-explicit-any */
import mysql from "mysql2/promise";
import { getTableConfig } from "drizzle-orm/mysql-core";
import * as schema from "../../db/schema";
import { env } from "../lib/env";

export interface RepairTarget {
  name: string;
  type: "UNIQUE_INDEX" | "UNIQUE_CONSTRAINT" | "INDEX";
  table: string;
  columns: string[];
  generateSql: () => string;
}

export interface InspectionResult {
  target: RepairTarget;
  status: "ALREADY_EXISTS" | "WOULD_CREATE" | "BLOCKED";
  reason?: string;
  sql?: string;
}

export interface DryRunSummary {
  database: string;
  serverVersion: string;
  connectionStatus: "SUCCESS" | "FAILED";
  alreadyPresent: string[];
  wouldCreate: string[];
  blocked: string[];
  errors: string[];
  ddlStatements: string[];
  tablesAudited: Record<string, number>;
}

// 1. Definition of the 13 required schema repair targets
export const REPAIR_TARGETS: RepairTarget[] = [
  {
    name: "users_email_unique",
    type: "UNIQUE_INDEX",
    table: "users",
    columns: ["email"],
    generateSql: () => "CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);",
  },
  {
    name: "users_unionId_unique",
    type: "UNIQUE_CONSTRAINT",
    table: "users",
    columns: ["unionId"],
    generateSql: () => "ALTER TABLE `users` ADD CONSTRAINT `users_unionId_unique` UNIQUE (`unionId`);",
  },
  {
    name: "settings_userId_unique",
    type: "UNIQUE_CONSTRAINT",
    table: "settings",
    columns: ["userId"],
    generateSql: () => "ALTER TABLE `settings` ADD CONSTRAINT `settings_userId_unique` UNIQUE (`userId`);",
  },
  {
    name: "fields_user_id_idx",
    type: "INDEX",
    table: "fields",
    columns: ["userId"],
    generateSql: () => "CREATE INDEX `fields_user_id_idx` ON `fields` (`userId`);",
  },
  {
    name: "harvests_user_field_idx",
    type: "INDEX",
    table: "harvests",
    columns: ["userId", "fieldId"],
    generateSql: () => "CREATE INDEX `harvests_user_field_idx` ON `harvests` (`userId`, `fieldId`);",
  },
  {
    name: "sales_user_harvest_idx",
    type: "INDEX",
    table: "sales",
    columns: ["userId", "harvestId"],
    generateSql: () => "CREATE INDEX `sales_user_harvest_idx` ON `sales` (`userId`, `harvestId`);",
  },
  {
    name: "inventory_items_user_id_idx",
    type: "INDEX",
    table: "inventory_items",
    columns: ["userId"],
    generateSql: () => "CREATE INDEX `inventory_items_user_id_idx` ON `inventory_items` (`userId`);",
  },
  {
    name: "sensors_user_field_idx",
    type: "INDEX",
    table: "sensors",
    columns: ["userId", "fieldId"],
    generateSql: () => "CREATE INDEX `sensors_user_field_idx` ON `sensors` (`userId`, `fieldId`);",
  },
  {
    name: "workers_user_id_idx",
    type: "INDEX",
    table: "workers",
    columns: ["userId"],
    generateSql: () => "CREATE INDEX `workers_user_id_idx` ON `workers` (`userId`);",
  },
  {
    name: "activities_user_created_idx",
    type: "INDEX",
    table: "activities",
    columns: ["userId", "createdAt"],
    generateSql: () => "CREATE INDEX `activities_user_created_idx` ON `activities` (`userId`, `createdAt`);",
  },
  {
    name: "ai_insights_user_cat_idx",
    type: "INDEX",
    table: "ai_insights",
    columns: ["userId", "category"],
    generateSql: () => "CREATE INDEX `ai_insights_user_cat_idx` ON `ai_insights` (`userId`, `category`);",
  },
  {
    name: "calendar_events_user_date_idx",
    type: "INDEX",
    table: "calendar_events",
    columns: ["userId", "eventDate"],
    generateSql: () => "CREATE INDEX `calendar_events_user_date_idx` ON `calendar_events` (`userId`, `eventDate`);",
  },
  {
    name: "notifications_user_read_idx",
    type: "INDEX",
    table: "notifications",
    columns: ["userId", "read"],
    generateSql: () => "CREATE INDEX `notifications_user_read_idx` ON `notifications` (`userId`, `read`);",
  },
];

/**
 * Validate that REPAIR_TARGETS exactly match db/schema.ts definitions.
 */
export function validateTargetsAgainstSchema(targets: RepairTarget[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const schemaMap: Record<string, any> = {
    users: schema.users,
    fields: schema.fields,
    harvests: schema.harvests,
    sales: schema.sales,
    inventory_items: schema.inventoryItems,
    sensors: schema.sensors,
    workers: schema.workers,
    activities: schema.activities,
    ai_insights: schema.aiInsights,
    calendar_events: schema.calendarEvents,
    notifications: schema.notifications,
    settings: schema.settings,
  };

  for (const t of targets) {
    const tableObj = schemaMap[t.table];
    if (!tableObj) {
      errors.push(`Table ${t.table} not found in db/schema.ts`);
      continue;
    }
    const config = getTableConfig(tableObj);
    for (const col of t.columns) {
      const colExists = config.columns.some((c: any) => c.name === col);
      if (!colExists) {
        errors.push(`Column ${col} not found on table ${t.table} in db/schema.ts`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Parse connection options safely from sanitized DATABASE_URL.
 */
export function parseConnectionConfig(databaseUrl: string) {
  const clean = databaseUrl.trim().replace(/^["']|["']$/g, "");
  const parsed = new URL(clean);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 4000,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    ssl: { rejectUnauthorized: true },
  };
}

export interface DbConnectionLike {
  query: (sql: string, values?: any[]) => Promise<[any[], any]>;
  end: () => Promise<void>;
}

/**
 * Audit and plan repairs safely without executing DDL in DRY-RUN mode.
 */
export async function planRepair(
  conn: DbConnectionLike,
  dbName: string,
  options: {
    targets?: RepairTarget[];
    allowNonZeroRows?: boolean;
  } = {}
): Promise<{ inspections: InspectionResult[]; summary: DryRunSummary }> {
  const targets = options.targets || REPAIR_TARGETS;

  // Schema validation
  const validation = validateTargetsAgainstSchema(targets);
  if (!validation.valid) {
    throw new Error(`Schema validation failed: ${validation.errors.join(", ")}`);
  }

  const [verRows] = await conn.query("SELECT VERSION() as v");
  const serverVersion = (verRows as any[])[0]?.v || "UNKNOWN";

  // Query existing indexes in TiDB information_schema
  const [statRows] = await conn.query(
    "SELECT TABLE_NAME, INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ?",
    [dbName]
  );
  const existingIndexes = new Set(
    (statRows as any[]).map((r) => `${r.TABLE_NAME}.${r.INDEX_NAME}`)
  );

  // Query row counts and check for duplicate data
  const affectedTables = Array.from(new Set(targets.map((t) => t.table)));
  const tableRowCounts: Record<string, number> = {};

  for (const table of affectedTables) {
    const [cntRows] = await conn.query(`SELECT COUNT(*) as c FROM ??`, [table]);
    tableRowCounts[table] = Number((cntRows as any[])[0]?.c || 0);
  }

  const inspections: InspectionResult[] = [];
  const alreadyPresent: string[] = [];
  const wouldCreate: string[] = [];
  const blocked: string[] = [];
  const errors: string[] = [];
  const ddlStatements: string[] = [];

  // Data Integrity checks on specific tables
  let duplicateEmails = 0;
  let caseInsensitiveDupEmails = 0;
  let nullOrEmptyEmails = 0;
  let duplicateUnionIds = 0;
  let duplicateUserIdsInSettings = 0;

  if (tableRowCounts["users"] > 0) {
    const [dupE] = await conn.query("SELECT email, COUNT(*) as c FROM users WHERE email IS NOT NULL GROUP BY email HAVING c > 1");
    duplicateEmails = (dupE as any[]).length;

    const [dupCiE] = await conn.query("SELECT LOWER(email) as le, COUNT(*) as c FROM users WHERE email IS NOT NULL GROUP BY LOWER(email) HAVING c > 1");
    caseInsensitiveDupEmails = (dupCiE as any[]).length;

    const [nullOrEmpty] = await conn.query("SELECT COUNT(*) as c FROM users WHERE email IS NULL OR TRIM(email) = ''");
    nullOrEmptyEmails = Number((nullOrEmpty as any[])[0]?.c || 0);

    const [dupU] = await conn.query("SELECT unionId, COUNT(*) as c FROM users WHERE unionId IS NOT NULL GROUP BY unionId HAVING c > 1");
    duplicateUnionIds = (dupU as any[]).length;
  }

  if (tableRowCounts["settings"] > 0) {
    const [dupS] = await conn.query("SELECT userId, COUNT(*) as c FROM settings GROUP BY userId HAVING c > 1");
    duplicateUserIdsInSettings = (dupS as any[]).length;
  }

  for (const target of targets) {
    const key = `${target.table}.${target.name}`;

    // 1. Check if already exists in information_schema
    if (existingIndexes.has(key)) {
      alreadyPresent.push(target.name);
      inspections.push({
        target,
        status: "ALREADY_EXISTS",
        reason: `Index/constraint '${target.name}' already exists on table '${target.table}'.`,
      });
      continue;
    }

    // 2. Validate row count constraint
    if (!options.allowNonZeroRows && tableRowCounts[target.table] > 0) {
      blocked.push(target.name);
      const reason = `Table '${target.table}' contains ${tableRowCounts[target.table]} rows. Strict zero-row rule blocked DDL generation.`;
      errors.push(reason);
      inspections.push({ target, status: "BLOCKED", reason });
      continue;
    }

    // 3. Unique data collision checks
    if (target.name === "users_email_unique") {
      if (duplicateEmails > 0 || caseInsensitiveDupEmails > 0) {
        blocked.push(target.name);
        const reason = `Duplicate emails detected (exact: ${duplicateEmails}, case-insensitive: ${caseInsensitiveDupEmails}).`;
        errors.push(reason);
        inspections.push({ target, status: "BLOCKED", reason });
        continue;
      }
      // Log presence of NULL/empty emails (TiDB allows multiple NULLs in UNIQUE index, but noting for transparency)
      if (nullOrEmptyEmails > 0) {
        console.warn(`[IndexRepair] Notice: ${nullOrEmptyEmails} NULL/empty email rows in users table.`);
      }
    }

    if (target.name === "users_unionId_unique") {
      if (duplicateUnionIds > 0) {
        blocked.push(target.name);
        const reason = `Duplicate non-null unionIds detected (${duplicateUnionIds} duplicates).`;
        errors.push(reason);
        inspections.push({ target, status: "BLOCKED", reason });
        continue;
      }
    }

    if (target.name === "settings_userId_unique") {
      if (duplicateUserIdsInSettings > 0) {
        blocked.push(target.name);
        const reason = `Duplicate settings.userId detected (${duplicateUserIdsInSettings} duplicates).`;
        errors.push(reason);
        inspections.push({ target, status: "BLOCKED", reason });
        continue;
      }
    }

    // Safe to plan creation
    const sql = target.generateSql();
    wouldCreate.push(target.name);
    ddlStatements.push(sql);
    inspections.push({
      target,
      status: "WOULD_CREATE",
      sql,
    });
  }

  const summary: DryRunSummary = {
    database: dbName,
    serverVersion,
    connectionStatus: "SUCCESS",
    alreadyPresent,
    wouldCreate,
    blocked,
    errors,
    ddlStatements,
    tablesAudited: tableRowCounts,
  };

  return { inspections, summary };
}

/**
 * Runner entrypoint. Default is strictly DRY-RUN.
 * Refuses to execute DDL unless CONFIRM_EXECUTE_PRODUCTION_DDL === "YES_I_AM_SURE"
 */
export async function runRepair(options: { execute?: boolean } = {}) {
  const confirmationFlag = process.env.CONFIRM_EXECUTE_PRODUCTION_DDL;
  const isExecuteRequested = options.execute === true;

  if (isExecuteRequested && confirmationFlag !== "YES_I_AM_SURE") {
    throw new Error(
      "SAFETY REFUSAL: Execution of production DDL requires environment variable CONFIRM_EXECUTE_PRODUCTION_DDL='YES_I_AM_SURE'."
    );
  }

  const databaseUrl = env.databaseUrl;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const config = parseConnectionConfig(databaseUrl);
  const conn = await mysql.createConnection(config);

  try {
    const { inspections, summary } = await planRepair(conn as unknown as DbConnectionLike, config.database);

    if (!isExecuteRequested) {
      // DRY-RUN mode (Default)
      return { mode: "DRY_RUN", summary, inspections };
    }

    // Guard: Under no circumstance execute if there are errors or blocked items
    if (summary.blocked.length > 0 || summary.errors.length > 0) {
      throw new Error(`Execution aborted due to blocked items or errors: ${summary.errors.join("; ")}`);
    }

    // If execution was confirmed and valid, execute DDL statements one by one
    const executed: string[] = [];
    for (const item of inspections) {
      if (item.status === "WOULD_CREATE" && item.sql) {
        console.log(`[IndexRepair] Executing: ${item.sql}`);
        await conn.query(item.sql);

        // Verification requirement 4: verify through information_schema that the expected object now exists
        const [verifyRows] = await conn.query(
          "SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?",
          [config.database, item.target.table, item.target.name]
        );

        if (!(verifyRows as any[]).length) {
          throw new Error(
            `Verification failed: Index/constraint '${item.target.name}' on table '${item.target.table}' was not detected in information_schema after execution.`
          );
        }

        console.log(`[IndexRepair] Successfully verified in information_schema: ${item.target.name}`);
        executed.push(item.target.name);
      }
    }

    return { mode: "EXECUTED", summary, executed };
  } finally {
    await conn.end();
  }
}
