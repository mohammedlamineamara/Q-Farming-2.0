import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { fieldsRouter } from "./routers/fields";
import { inventoryRouter } from "./routers/inventory";
import { sensorsRouter } from "./routers/sensors";
import { workersRouter } from "./routers/workers";
import { activitiesRouter } from "./routers/activities";
import { aiInsightsRouter } from "./routers/aiInsights";
import { calendarRouter } from "./routers/calendar";
import { notificationsRouter } from "./routers/notifications";
import { settingsRouter } from "./routers/settings";
import { analyticsRouter } from "./routers/analytics";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  fields: fieldsRouter,
  inventory: inventoryRouter,
  sensors: sensorsRouter,
  workers: workersRouter,
  activities: activitiesRouter,
  aiInsights: aiInsightsRouter,
  calendar: calendarRouter,
  notifications: notificationsRouter,
  settings: settingsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
