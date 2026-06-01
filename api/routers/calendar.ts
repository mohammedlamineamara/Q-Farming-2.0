import { z } from "zod";
import { createRouter, authedQuery, authedMutation } from "../middleware";
import { getDb } from "../queries/connection";
import { calendarEvents } from "../../db/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export const calendarRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.userId, ctx.user.id))
      .orderBy(desc(calendarEvents.eventDate));
  }),

  upcoming: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const now = new Date();
    return db
      .select()
      .from(calendarEvents)
      .where(and(eq(calendarEvents.userId, ctx.user.id), gte(calendarEvents.eventDate, now)))
      .orderBy(calendarEvents.eventDate);
  }),

  create: authedMutation
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        eventDate: z.string(),
        fieldId: z.number().optional(),
        workerId: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(calendarEvents).values({
        ...input,
        eventDate: new Date(input.eventDate),
        userId: ctx.user.id,
      });
      return { id: Number(result[0].insertId) };
    }),

  update: authedMutation
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        eventDate: z.string().optional(),
        fieldId: z.number().optional(),
        workerId: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.eventDate) {
        updateData.eventDate = new Date(data.eventDate);
      }
      await db
        .update(calendarEvents)
        .set(updateData)
        .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, ctx.user.id)));
      return { success: true };
    }),

  delete: authedMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(calendarEvents)
        .where(and(eq(calendarEvents.id, input.id), eq(calendarEvents.userId, ctx.user.id)));
      return { success: true };
    }),
});
