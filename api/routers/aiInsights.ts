import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { aiInsights } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

export const aiInsightsRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.userId, ctx.user.id))
      .orderBy(desc(aiInsights.createdAt));
  }),

  create: authedMutation
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        icon: z.string().default("🤖"),
        confidence: z.number().min(0).max(100).default(90),
        category: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(aiInsights).values({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId) };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(aiInsights)
        .where(and(eq(aiInsights.id, input.id), eq(aiInsights.userId, ctx.user.id)));
      return { success: true };
    }),
});
