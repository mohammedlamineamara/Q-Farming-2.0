/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import { getTableName } from "drizzle-orm";
import { MySqlDialect } from "drizzle-orm/mysql-core";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };
const dialect = new MySqlDialect();

const tables: Record<string, any[]> = {
  users: [
    {
      id: 1,
      unionId: "demo-user",
      name: "Ahmed B.",
      email: "ahmed@qfarming.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      password: "$2b$10$8v.2YMoPK8oN4TK6S3wHGe3ixc1polLwVfxJdhUxv2yHh3rGI8n0C",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    },
  ],
  fields: [
    {
      id: 1,
      name: "Field A - Wheat",
      crop: "Wheat",
      size: "12.5",
      status: "active",
      progress: 78,
      location: "Algiers North",
      lat: "36.75°N",
      lng: "3.06°E",
      moisture: 68,
      temp: 31,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Field B - Barley",
      crop: "Barley",
      size: "8.3",
      status: "irrigation",
      progress: 45,
      location: "Algiers South",
      lat: "36.72°N",
      lng: "3.08°E",
      moisture: 72,
      temp: 33,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Field C - Oats",
      crop: "Oats",
      size: "5.0",
      status: "harvest",
      progress: 92,
      location: "Blida",
      lat: "36.48°N",
      lng: "2.83°E",
      moisture: 55,
      temp: 30,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  inventory_items: [
    { id: 1, name: "Wheat Seeds", category: "seeds", stock: 450, unit: "kg", icon: "🌱", max: 500, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "NPK Fertilizer", category: "fertilizer", stock: 12, unit: "bags", icon: "🧪", max: 50, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: "Drip Irrigation", category: "equipment", stock: 3, unit: "units", icon: "💧", max: 10, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: "Barley Seeds", category: "seeds", stock: 200, unit: "kg", icon: "🌱", max: 300, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: "Organic Compost", category: "fertilizer", stock: 25, unit: "bags", icon: "🧪", max: 40, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: "Tractor Tires", category: "equipment", stock: 2, unit: "pcs", icon: "🔧", max: 8, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: "Pesticide A", category: "pesticide", stock: 8, unit: "L", icon: "🛡️", max: 20, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: "Corn Seeds", category: "seeds", stock: 320, unit: "kg", icon: "🌱", max: 400, userId: 1, createdAt: new Date(), updatedAt: new Date() },
  ],
  sensors: [
    { id: 1, name: "Soil Moisture", value: "68", unit: "%", max: 100, status: "optimal", color: "#10b981", icon: "💧", fieldId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "Temperature", value: "31", unit: "°C", max: 50, status: "optimal", color: "#f59e0b", icon: "🌡️", fieldId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: "Humidity", value: "45", unit: "%", max: 100, status: "optimal", color: "#3b82f6", icon: "💨", fieldId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: "pH Level", value: "6.8", unit: "pH", max: 14, status: "optimal", color: "#8b5cf6", icon: "⚗️", fieldId: 2, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: "Nitrogen", value: "45", unit: "%", max: 100, status: "warning", color: "#06b6d4", icon: "🧪", fieldId: 2, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: "Light Intensity", value: "850", unit: "lux", max: 1000, status: "optimal", color: "#fbbf24", icon: "☀️", fieldId: 3, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 7, name: "CO2 Level", value: "420", unit: "ppm", max: 600, status: "optimal", color: "#10b981", icon: "🌬️", fieldId: 3, userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 8, name: "Wind Speed", value: "12", unit: "km/h", max: 30, status: "optimal", color: "#60a5fa", icon: "💨", fieldId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
  ],
  workers: [
    { id: 1, name: "Ahmed B.", role: "Field Manager", status: "online", avatar: "👨‍🌾", phone: "+2135550001", email: "ahmed@qfarming.com", userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: "Fatima K.", role: "Agronomist", status: "online", avatar: "👩‍🔬", phone: "+2135550002", email: "fatima@qfarming.com", userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, name: "Karim M.", role: "Equipment Operator", status: "busy", avatar: "👷", phone: "+2135550003", email: "karim@qfarming.com", userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 4, name: "Amina R.", role: "Data Analyst", status: "online", avatar: "👩‍💻", phone: "+2135550004", email: "amina@qfarming.com", userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 5, name: "Youssef T.", role: "Irrigation Tech", status: "offline", avatar: "👨‍🔧", phone: "+2135550005", email: "youssef@qfarming.com", userId: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: 6, name: "Sara L.", role: "Quality Inspector", status: "online", avatar: "👩‍🔬", phone: "+2135550006", email: "sara@qfarming.com", userId: 1, createdAt: new Date(), updatedAt: new Date() },
  ],
  activities: [
    { id: 1, title: "Irrigation completed - Field A", icon: "💧", type: "success", read: false, userId: 1, createdAt: new Date(Date.now() - 3600000) },
    { id: 2, title: "Fertilizer applied - Field B", icon: "🧪", type: "warning", read: false, userId: 1, createdAt: new Date(Date.now() - 7200000) },
    { id: 3, title: "Harvest started - Field C", icon: "🌾", type: "success", read: true, userId: 1, createdAt: new Date(Date.now() - 14400000) },
    { id: 4, title: "Weather alert: High temp expected", icon: "☀️", type: "danger", read: true, userId: 1, createdAt: new Date(Date.now() - 28800000) },
    { id: 5, title: "Sensor calibration complete", icon: "📡", type: "info", read: true, userId: 1, createdAt: new Date(Date.now() - 43200000) },
    { id: 6, title: "Inventory restocked - Seeds", icon: "📦", type: "success", read: true, userId: 1, createdAt: new Date(Date.now() - 86400000) },
  ],
  ai_insights: [
    {
      id: 1,
      title: "Water Optimization Recommendation",
      content: "Based on soil moisture sensors and weather forecast, AI recommends reducing irrigation by 15% for Field A. Current soil moisture at 68% is above optimal threshold. Estimated water savings: 367L/day.",
      icon: "💧",
      confidence: 94,
      category: "water",
      userId: 1,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Harvest Prediction",
      content: "Field C (Oats) is predicted to reach optimal harvest maturity in 3 days. Current growth stage: 92% complete. Weather forecast shows favorable conditions. Recommended harvest window: June 2-4, 2026.",
      icon: "🌾",
      confidence: 91,
      category: "harvest",
      userId: 1,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Fertilizer Schedule Optimization",
      content: "Nitrogen levels in Field B are declining faster than projected. AI suggests advancing next fertilizer application by 2 days. Current NPK balance: N-45%, P-32%, K-38%. Target: N-50%, P-30%, K-35%.",
      icon: "🧪",
      confidence: 88,
      category: "fertilizer",
      userId: 1,
      createdAt: new Date(),
    },
    {
      id: 4,
      title: "Weather Risk Alert",
      content: "High probability of heatwave (38°C+) in next 48 hours. AI recommends activating shade nets for sensitive crops and increasing evening irrigation cycles. UV index expected to reach 9+ on Thursday.",
      icon: "⚠️",
      confidence: 87,
      category: "weather",
      userId: 1,
      createdAt: new Date(),
    },
  ],
  calendar_events: [
    { id: 1, title: "Irrigation - Field A", description: "Morning irrigation cycle", eventDate: new Date(Date.now() + 86400000), fieldId: 1, workerId: 5, priority: "high", userId: 1, createdAt: new Date() },
    { id: 2, title: "Fertilizer Application - Field B", description: "NPK fertilizer application", eventDate: new Date(Date.now() + 2 * 86400000), fieldId: 2, workerId: 2, priority: "medium", userId: 1, createdAt: new Date() },
    { id: 3, title: "Harvest - Field C", description: "Oats harvest operation", eventDate: new Date(Date.now() + 4 * 86400000), fieldId: 3, workerId: 1, priority: "urgent", userId: 1, createdAt: new Date() },
    { id: 4, title: "Equipment Maintenance", description: "Tractor service and inspection", eventDate: new Date(Date.now() + 5 * 86400000), workerId: 3, priority: "low", userId: 1, createdAt: new Date() },
  ],
  notifications: [
    { id: 1, title: "Irrigation Complete", description: "Field A - Wheat irrigation cycle completed successfully", icon: "💧", read: false, userId: 1, createdAt: new Date(Date.now() - 1800000) },
    { id: 2, title: "Weather Alert", description: "High temperature expected tomorrow - 38°C peak", icon: "⚠️", read: false, userId: 1, createdAt: new Date(Date.now() - 3600000) },
    { id: 3, title: "Low Stock Alert", description: "NPK Fertilizer stock below threshold (12 bags remaining)", icon: "📦", read: true, userId: 1, createdAt: new Date(Date.now() - 7200000) },
    { id: 4, title: "Harvest Ready", description: "Field C - Oats at 92% maturity, ready for harvest", icon: "🌾", read: true, userId: 1, createdAt: new Date(Date.now() - 86400000) },
  ],
  settings: [
    {
      id: 1,
      userId: 1,
      theme: "dark",
      offlineMode: true,
      autoSync: true,
      gpsTracking: true,
      aiNotifications: true,
      predictiveAnalytics: true,
      farmLocation: "Algiers, Algeria",
      updatedAt: new Date(),
    },
  ],
  harvests: [],
  sales: [],
};

let nextId = 100;

function evaluateCondition(row: Record<string, any>, cond: any): boolean {
  if (!cond) return true;
  try {
    const { sql, params } = dialect.sqlToQuery(cond);
    let paramIdx = 0;
    const jsExpr = sql
      .replace(/`[^`]+`\.`([^`]+)`/g, "row.$1")
      .replace(/`([^`]+)`/g, "row.$1")
      .replace(/\?/g, () => {
        const p = params[paramIdx++];
        if (p === null || p === undefined) return "null";
        if (p instanceof Date) return String(p.getTime());
        if (typeof p === "string" && /^\d{4}-\d{2}-\d{2}/.test(p)) {
          return String(new Date(p).getTime());
        }
        return JSON.stringify(p);
      })
      .replace(/\s+and\s+/gi, " && ")
      .replace(/\s+or\s+/gi, " || ")
      .replace(/([^><!])=([^=])/g, "$1===$2");

    const fn = new Function("row", `
      const r = { ...row };
      for (const k in r) {
        if (r[k] instanceof Date) {
          r[k] = r[k].getTime();
        }
      }
      return Boolean(${jsExpr.replace(/row\.(\w+)/g, "r.$1")});
    `);
    return fn(row);
  } catch {
    return true;
  }
}

function sortRows(rows: any[], orderBys: any[]): any[] {
  if (!orderBys || orderBys.length === 0) return rows;
  return [...rows].sort((a, b) => {
    for (const ob of orderBys) {
      try {
        const { sql } = dialect.sqlToQuery(ob);
        const isDesc = /\bdesc\b/i.test(sql);
        const colMatch = sql.match(/`([^`]+)`(?:\.`([^`]+)`)?/);
        const col = colMatch ? (colMatch[2] || colMatch[1]) : null;
        if (col) {
          let valA = a[col];
          let valB = b[col];
          if (valA instanceof Date) valA = valA.getTime();
          if (valB instanceof Date) valB = valB.getTime();
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
        }
      } catch {
        // ignore
      }
    }
    return 0;
  });
}

function createMockDb(): any {
  return {
    select(fields?: any) {
      const isCountQuery = fields && typeof fields === "object" && "count" in fields;
      return {
        from(table: any) {
          const tableName = getTableName(table);
          let cond: any = null;
          const orderBys: any[] = [];
          let limitCount: number | null = null;

          const queryObj = {
            where(condition: any) {
              cond = condition;
              return queryObj;
            },
            orderBy(...orders: any[]) {
              orderBys.push(...orders);
              return queryObj;
            },
            limit(n: number) {
              limitCount = n;
              return queryObj;
            },
            then(resolve: (val: any) => void) {
              const list = tables[tableName] || [];
              let filtered = list.filter((row) => evaluateCondition(row, cond));
              if (isCountQuery) {
                return Promise.resolve([{ count: filtered.length }]).then(resolve);
              }
              if (orderBys.length > 0) {
                filtered = sortRows(filtered, orderBys);
              }
              if (limitCount !== null) {
                filtered = filtered.slice(0, limitCount);
              }
              return Promise.resolve(filtered.map((r) => ({ ...r }))).then(resolve);
            },
          };
          return queryObj;
        },
      };
    },

    insert(table: any) {
      const tableName = getTableName(table);
      return {
        values(rowOrRows: any) {
          const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
          let lastInsertId = 0;
          if (!tables[tableName]) {
            tables[tableName] = [];
          }

          const executeInsert = () => {
            for (const r of rows) {
              const id = r.id || nextId++;
              lastInsertId = id;
              tables[tableName].push({
                ...r,
                id,
                createdAt: r.createdAt || new Date(),
                updatedAt: r.updatedAt || new Date(),
              });
            }
            return [{ insertId: lastInsertId }];
          };

          const insertObj = {
            onDuplicateKeyUpdate({ set }: { set: any }) {
              for (const r of rows) {
                const existing = tables[tableName].find((item) =>
                  (r.id && item.id === r.id) ||
                  (r.unionId && item.unionId === r.unionId) ||
                  (r.email && item.email === r.email)
                );
                if (existing) {
                  Object.assign(existing, set, { updatedAt: new Date() });
                  lastInsertId = existing.id;
                } else {
                  const id = r.id || nextId++;
                  lastInsertId = id;
                  tables[tableName].push({
                    ...r,
                    ...set,
                    id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  });
                }
              }
              return Promise.resolve([{ insertId: lastInsertId }]);
            },
            then(resolve: (val: any) => void) {
              return Promise.resolve(executeInsert()).then(resolve);
            },
          };

          return insertObj;
        },
      };
    },

    update(table: any) {
      const tableName = getTableName(table);
      return {
        set(data: any) {
          return {
            where(condition: any) {
              return {
                then(resolve: (val: any) => void) {
                  const list = tables[tableName] || [];
                  let updatedCount = 0;
                  for (const row of list) {
                    if (evaluateCondition(row, condition)) {
                      Object.assign(row, data, { updatedAt: new Date() });
                      updatedCount++;
                    }
                  }
                  return Promise.resolve([{ affectedRows: updatedCount }]).then(resolve);
                },
              };
            },
          };
        },
      };
    },

    delete(table: any) {
      const tableName = getTableName(table);
      return {
        where(condition: any) {
          return {
            then(resolve: (val: any) => void) {
              const list = tables[tableName] || [];
              const beforeCount = list.length;
              tables[tableName] = list.filter((row) => !evaluateCondition(row, condition));
              const deletedCount = beforeCount - tables[tableName].length;
              return Promise.resolve([{ affectedRows: deletedCount }]).then(resolve);
            },
          };
        },
      };
    },
  };
}

let instance: any;
let dbInitializer: any = drizzle;

export function getDb(): MySql2Database<typeof fullSchema> {
  if (!instance) {
    const isProduction = process.env.NODE_ENV === "production" || env.isProduction;

    if (isProduction) {
      if (!env.databaseUrl) {
        throw new Error("Production database is not configured");
      }

      try {
        instance = dbInitializer(env.databaseUrl, {
          mode: "planetscale",
          schema: fullSchema,
        });
      } catch (err: unknown) {
        const safeMessage =
          err instanceof Error
            ? err.message.replace(/:\/\/.*@/, "://***@")
            : "Unknown initialization error";
        console.error("[Database] Failed to initialize production database:", safeMessage);
        throw new Error("Failed to initialize production database");
      }
    } else {
      if (env.databaseUrl) {
        try {
          instance = dbInitializer(env.databaseUrl, {
            mode: "planetscale",
            schema: fullSchema,
          });
        } catch (err: unknown) {
          const safeMessage =
            err instanceof Error
              ? err.message.replace(/:\/\/.*@/, "://***@")
              : "Unknown initialization error";
          console.warn("[Database] Failed to connect to DATABASE_URL in development, using mock db:", safeMessage);
          instance = createMockDb();
        }
      } else {
        instance = createMockDb();
      }
    }
  }
  return instance as MySql2Database<typeof fullSchema>;
}

/**
 * Internal helpers for testing database connection behavior.
 */
export function _resetDbInstance(): void {
  instance = undefined;
  dbInitializer = drizzle;
}

export function _setDbInitializer(fn: any): void {
  dbInitializer = fn;
}
