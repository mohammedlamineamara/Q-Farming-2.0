import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { settings } from "../../db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const result = await db.select().from(settings).where(eq(settings.userId, ctx.user.id));
    return result[0] ?? null;
  }),

  upsert: authedMutation
    .input(
      z.object({
        theme: z.enum(["light", "dark"]).optional(),
        offlineMode: z.boolean().optional(),
        autoSync: z.boolean().optional(),
        gpsTracking: z.boolean().optional(),
        aiNotifications: z.boolean().optional(),
        predictiveAnalytics: z.boolean().optional(),
        farmLocation: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db.select().from(settings).where(eq(settings.userId, ctx.user.id));

      if (existing.length > 0) {
        await db
          .update(settings)
          .set(input)
          .where(eq(settings.userId, ctx.user.id));
      } else {
        await db.insert(settings).values({
          ...input,
          userId: ctx.user.id,
        });
      }
      return { success: true };
    }),
});
