import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { workers } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const workersRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(workers).where(eq(workers.userId, ctx.user.id));
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(workers)
        .where(and(eq(workers.id, input.id), eq(workers.userId, ctx.user.id)));
      return result[0] ?? null;
    }),

  create: authedMutation
    .input(
      z.object({
        name: z.string().min(1),
        role: z.string().min(1),
        status: z.enum(["online", "offline", "busy"]).default("offline"),
        avatar: z.string().default("👷"),
        phone: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(workers).values({
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
        role: z.string().optional(),
        status: z.enum(["online", "offline", "busy"]).optional(),
        avatar: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(workers)
        .set(data)
        .where(and(eq(workers.id, id), eq(workers.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(workers)
        .where(and(eq(workers.id, input.id), eq(workers.userId, ctx.user.id)));
      return { success: true };
    }),
});
