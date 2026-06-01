import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { fields, inventoryItems, sensors, workers, activities } from "../../db/schema";
import { eq, count } from "drizzle-orm";

export const analyticsRouter = createRouter({
  dashboard: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const [fieldCount] = await db
      .select({ count: count() })
      .from(fields)
      .where(eq(fields.userId, userId));

    const [sensorCount] = await db
      .select({ count: count() })
      .from(sensors)
      .where(eq(sensors.userId, userId));

    const [workerCount] = await db
      .select({ count: count() })
      .from(workers)
      .where(eq(workers.userId, userId));

    const [activityCount] = await db
      .select({ count: count() })
      .from(activities)
      .where(eq(activities.userId, userId));

    const fieldList = await db
      .select()
      .from(fields)
      .where(eq(fields.userId, userId));

    const avgProgress = fieldList.length > 0
      ? Math.round(fieldList.reduce((sum: number, f: typeof fieldList[0]) => sum + f.progress, 0) / fieldList.length)
      : 0;

    const inventoryList = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.userId, userId));

    const lowStockItems = inventoryList.filter((i: typeof inventoryList[0]) => i.stock < 20);

    return {
      activeFields: fieldCount?.count ?? 0,
      totalSensors: sensorCount?.count ?? 0,
      totalWorkers: workerCount?.count ?? 0,
      totalActivities: activityCount?.count ?? 0,
      avgProgress,
      lowStockCount: lowStockItems.length,
      totalInventory: inventoryList.length,
      efficiency: 87,
    };
  }),

  yieldTrend: authedQuery.query(async () => {
    return [
      { label: "Jan", wheat: 30, barley: 20, oats: 15 },
      { label: "Feb", wheat: 45, barley: 35, oats: 25 },
      { label: "Mar", wheat: 60, barley: 50, oats: 40 },
      { label: "Apr", wheat: 75, barley: 65, oats: 55 },
      { label: "May", wheat: 90, barley: 80, oats: 70 },
      { label: "Jun", wheat: 100, barley: 95, oats: 85 },
    ];
  }),

  revenueTrend: authedQuery.query(async () => {
    return [
      { month: "Jan", value: 680 },
      { month: "Feb", value: 720 },
      { month: "Mar", value: 850 },
      { month: "Apr", value: 920 },
      { month: "May", value: 1050 },
      { month: "Jun", value: 1200 },
    ];
  }),

  sensorTrend: authedQuery.query(async () => {
    return [45, 52, 48, 61, 55, 68, 72, 65, 58, 62, 70, 75];
  }),
});
