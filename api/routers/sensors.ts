import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { sensors } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { verifyFieldOwnership } from "../lib/tenant";

export const sensorsRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(sensors).where(eq(sensors.userId, ctx.user.id));
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(sensors)
        .where(and(eq(sensors.id, input.id), eq(sensors.userId, ctx.user.id)));
      return result[0] ?? null;
    }),

  create: authedMutation
    .input(
      z.object({
        name: z.string().min(1).max(100),
        value: z.string().min(1).max(50),
        unit: z.string().min(1).max(20),
        max: z.number().default(100),
        status: z.enum(["optimal", "warning", "critical"]).default("optimal"),
        color: z.string().default("#10b981"),
        icon: z.string().default("📡"),
        fieldId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate foreign-key tenant ownership
      if (input.fieldId !== undefined) {
        await verifyFieldOwnership(input.fieldId, ctx.user.id);
      }

      const db = getDb();
      const result = await db.insert(sensors).values({
        ...input,
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: authedMutation
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        value: z.string().min(1).max(50).optional(),
        unit: z.string().min(1).max(20).optional(),
        max: z.number().optional(),
        status: z.enum(["optimal", "warning", "critical"]).optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
        fieldId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate foreign-key tenant ownership
      if (input.fieldId !== undefined) {
        await verifyFieldOwnership(input.fieldId, ctx.user.id);
      }

      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(sensors)
        .set(data)
        .where(and(eq(sensors.id, id), eq(sensors.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(sensors)
        .where(and(eq(sensors.id, input.id), eq(sensors.userId, ctx.user.id)));
      return { success: true };
    }),
});
