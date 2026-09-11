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
        name: z.string().min(1).max(100),
        role: z.string().min(1).max(100),
        status: z.enum(["online", "offline", "busy"]).default("offline"),
        avatar: z.string().max(50).default("👷"),
        phone: z.string().max(30).optional(),
        email: z.string().email().max(255).optional(),
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
        name: z.string().min(1).max(100).optional(),
        role: z.string().min(1).max(100).optional(),
        status: z.enum(["online", "offline", "busy"]).optional(),
        avatar: z.string().max(50).optional(),
        phone: z.string().max(30).optional(),
        email: z.string().email().max(255).optional(),
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
