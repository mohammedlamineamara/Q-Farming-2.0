import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { fields } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export const fieldsRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(fields).where(eq(fields.userId, ctx.user.id));
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(fields)
        .where(and(eq(fields.id, input.id), eq(fields.userId, ctx.user.id)));
      return result[0] ?? null;
    }),

  create: authedMutation
    .input(
      z.object({
        name: z.string().min(1),
        crop: z.string().min(1),
        size: z.string().min(1),
        status: z.enum(["active", "irrigation", "harvest", "fallow"]).default("active"),
        progress: z.number().min(0).max(100).default(0),
        location: z.string().min(1),
        lat: z.string().default("36.75°N"),
        lng: z.string().default("3.06°E"),
        moisture: z.number().default(0),
        temp: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(fields).values({
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
        crop: z.string().optional(),
        size: z.string().optional(),
        status: z.enum(["active", "irrigation", "harvest", "fallow"]).optional(),
        progress: z.number().optional(),
        location: z.string().optional(),
        lat: z.string().optional(),
        lng: z.string().optional(),
        moisture: z.number().optional(),
        temp: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(fields)
        .set(data)
        .where(and(eq(fields.id, id), eq(fields.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(fields)
        .where(and(eq(fields.id, input.id), eq(fields.userId, ctx.user.id)));
      return { success: true };
    }),
});
