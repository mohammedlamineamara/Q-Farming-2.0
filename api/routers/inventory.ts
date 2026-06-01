import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { inventoryItems } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const inventoryRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(inventoryItems).where(eq(inventoryItems.userId, ctx.user.id));
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(inventoryItems)
        .where(and(eq(inventoryItems.id, input.id), eq(inventoryItems.userId, ctx.user.id)));
      return result[0] ?? null;
    }),

  create: authedMutation
    .input(
      z.object({
        name: z.string().min(1),
        category: z.enum(["seeds", "fertilizer", "equipment", "pesticide", "other"]),
        stock: z.number().default(0),
        max: z.number().default(100),
        unit: z.string().min(1),
        icon: z.string().default("📦"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(inventoryItems).values({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: authedMutation
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.enum(["seeds", "fertilizer", "equipment", "pesticide", "other"]).optional(),
        stock: z.number().optional(),
        max: z.number().optional(),
        unit: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(inventoryItems)
        .set(data)
        .where(and(eq(inventoryItems.id, id), eq(inventoryItems.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(inventoryItems)
        .where(and(eq(inventoryItems.id, input.id), eq(inventoryItems.userId, ctx.user.id)));
      return { success: true };
    }),
});
