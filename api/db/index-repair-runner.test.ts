/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import {
  REPAIR_TARGETS,
  validateTargetsAgainstSchema,
  planRepair,
  runRepair,
  type RepairTarget,
  type DbConnectionLike,
} from "./index-repair-runner";

describe("Production Index Repair Runner (Phase 4I)", () => {
  it("validates all 13 targets match db/schema.ts tables and columns", () => {
    const result = validateTargetsAgainstSchema(REPAIR_TARGETS);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(REPAIR_TARGETS).toHaveLength(13);
  });

  it("blocks targets with invalid table or column names", () => {
    const invalidTargets: RepairTarget[] = [
      {
        name: "invalid_table_idx",
        type: "INDEX",
        table: "non_existent_table",
        columns: ["id"],
        generateSql: () => "CREATE INDEX `invalid_table_idx` ON `non_existent_table` (`id`);",
      },
      {
        name: "invalid_col_idx",
        type: "INDEX",
        table: "users",
        columns: ["non_existent_column"],
        generateSql: () => "CREATE INDEX `invalid_col_idx` ON `users` (`non_existent_column`);",
      },
    ];

    const result = validateTargetsAgainstSchema(invalidTargets);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it("skips indexes that already exist in information_schema (ALREADY_EXISTS)", async () => {
    const mockConn: DbConnectionLike = {
      query: vi.fn().mockImplementation(async (sql: string) => {
        if (sql.includes("SELECT VERSION()")) {
          return [[{ v: "8.0.11-TiDB-v8.5.3-serverless" }], []];
        }
        if (sql.includes("information_schema.STATISTICS")) {
          return [[{ TABLE_NAME: "fields", INDEX_NAME: "fields_user_id_idx" }], []];
        }
        if (sql.includes("SELECT COUNT(*)")) {
          return [[{ c: 0 }], []];
        }
        return [[], []];
      }),
      end: vi.fn().mockResolvedValue(undefined),
    };

    const target: RepairTarget = {
      name: "fields_user_id_idx",
      type: "INDEX",
      table: "fields",
      columns: ["userId"],
      generateSql: () => "CREATE INDEX `fields_user_id_idx` ON `fields` (`userId`);",
    };

    const { inspections, summary } = await planRepair(mockConn, "q_farming", {
      targets: [target],
    });

    expect(summary.alreadyPresent).toContain("fields_user_id_idx");
    expect(summary.wouldCreate).toHaveLength(0);
    expect(inspections[0].status).toBe("ALREADY_EXISTS");
  });

  it("marks missing index as WOULD_CREATE in a zero-row database", async () => {
    const mockConn: DbConnectionLike = {
      query: vi.fn().mockImplementation(async (sql: string) => {
        if (sql.includes("SELECT VERSION()")) {
          return [[{ v: "8.0.11-TiDB-v8.5.3-serverless" }], []];
        }
        if (sql.includes("information_schema.STATISTICS")) {
          return [[], []]; // No secondary indexes exist
        }
        if (sql.includes("SELECT COUNT(*)")) {
          return [[{ c: 0 }], []]; // 0 rows
        }
        return [[], []];
      }),
      end: vi.fn().mockResolvedValue(undefined),
    };

    const target: RepairTarget = {
      name: "workers_user_id_idx",
      type: "INDEX",
      table: "workers",
      columns: ["userId"],
      generateSql: () => "CREATE INDEX `workers_user_id_idx` ON `workers` (`userId`);",
    };

    const { inspections, summary } = await planRepair(mockConn, "q_farming", {
      targets: [target],
    });

    expect(summary.wouldCreate).toContain("workers_user_id_idx");
    expect(summary.alreadyPresent).toHaveLength(0);
    expect(summary.blocked).toHaveLength(0);
    expect(inspections[0].status).toBe("WOULD_CREATE");
    expect(inspections[0].sql).toBe("CREATE INDEX `workers_user_id_idx` ON `workers` (`userId`);");
  });

  it("blocks unique constraint creation when duplicate values exist in the table", async () => {
    const mockConn: DbConnectionLike = {
      query: vi.fn().mockImplementation(async (sql: string, values?: any[]) => {
        if (sql.includes("SELECT VERSION()")) {
          return [[{ v: "8.0.11-TiDB-v8.5.3-serverless" }], []];
        }
        if (sql.includes("information_schema.STATISTICS")) {
          return [[], []];
        }
        if (sql.includes("SELECT COUNT(*) as c FROM") && values?.[0] === "users") {
          return [[{ c: 2 }], []]; // 2 rows exist in users table
        }
        if (sql.includes("SELECT email, COUNT(*)")) {
          return [[{ email: "dup@farm.com", c: 2 }], []]; // Duplicate email
        }
        if (sql.includes("SELECT LOWER(email)")) {
          return [[{ le: "dup@farm.com", c: 2 }], []];
        }
        if (sql.includes("SELECT unionId")) {
          return [[], []];
        }
        return [[{ c: 0 }], []];
      }),
      end: vi.fn().mockResolvedValue(undefined),
    };

    const target: RepairTarget = {
      name: "users_email_unique",
      type: "UNIQUE_INDEX",
      table: "users",
      columns: ["email"],
      generateSql: () => "CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);",
    };

    const { inspections, summary } = await planRepair(mockConn, "q_farming", {
      targets: [target],
      allowNonZeroRows: true, // Test specifically duplicate email detection logic
    });

    expect(summary.blocked).toContain("users_email_unique");
    expect(summary.wouldCreate).not.toContain("users_email_unique");
    expect(inspections[0].status).toBe("BLOCKED");
    expect(inspections[0].reason).toContain("Duplicate emails detected");
  });

  it("blocks DDL generation when table has rows and strict zero-row rule is active", async () => {
    const mockConn: DbConnectionLike = {
      query: vi.fn().mockImplementation(async (sql: string) => {
        if (sql.includes("SELECT VERSION()")) {
          return [[{ v: "8.0.11-TiDB-v8.5.3-serverless" }], []];
        }
        if (sql.includes("information_schema.STATISTICS")) {
          return [[], []];
        }
        if (sql.includes("SELECT COUNT(*)")) {
          return [[{ c: 5 }], []]; // 5 rows exist
        }
        return [[], []];
      }),
      end: vi.fn().mockResolvedValue(undefined),
    };

    const target: RepairTarget = {
      name: "fields_user_id_idx",
      type: "INDEX",
      table: "fields",
      columns: ["userId"],
      generateSql: () => "CREATE INDEX `fields_user_id_idx` ON `fields` (`userId`);",
    };

    const { inspections, summary } = await planRepair(mockConn, "q_farming", {
      targets: [target],
    });

    expect(summary.blocked).toContain("fields_user_id_idx");
    expect(inspections[0].status).toBe("BLOCKED");
    expect(inspections[0].reason).toContain("Strict zero-row rule blocked DDL generation");
  });

  it("refuses to execute production DDL without explicit confirmation flag", async () => {
    delete process.env.CONFIRM_EXECUTE_PRODUCTION_DDL;

    await expect(runRepair({ execute: true })).rejects.toThrow(
      "SAFETY REFUSAL: Execution of production DDL requires environment variable CONFIRM_EXECUTE_PRODUCTION_DDL='YES_I_AM_SURE'."
    );
  });
});
