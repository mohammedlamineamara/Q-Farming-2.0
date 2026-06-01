import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { activities } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const activitiesRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(activities)
      .where(eq(activities.userId, ctx.user.id))
      .orderBy(desc(activities.createdAt));
  }),

  create: authedMutation
    .input(
      z.object({
        title: z.string().min(1),
        icon: z.string().default("📋"),
        type: z.enum(["success", "warning", "danger", "info"]).default("info"),
        read: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(activities).values({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId) };
    }),

  markRead: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(activities)
        .set({ read: true })
        .where(and(eq(activities.id, input.id), eq(activities.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(activities)
        .where(and(eq(activities.id, input.id), eq(activities.userId, ctx.user.id)));
      return { success: true };
    }),
});
