import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { getDb } from "../queries/connection";
import { fields, workers } from "../../db/schema";

/**
 * Asserts that the given field ID belongs to the authenticated user.
 * Throws NOT_FOUND if the field does not exist or belongs to another tenant.
 */
export async function verifyFieldOwnership(fieldId: number | undefined | null, userId: number): Promise<void> {
  if (fieldId === undefined || fieldId === null) return;

  const db = getDb();
  const [field] = await db
    .select({ id: fields.id })
    .from(fields)
    .where(and(eq(fields.id, fieldId), eq(fields.userId, userId)))
    .limit(1);

  if (!field) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Field not found",
    });
  }
}

/**
 * Asserts that the given worker ID belongs to the authenticated user.
 * Throws NOT_FOUND if the worker does not exist or belongs to another tenant.
 */
export async function verifyWorkerOwnership(workerId: number | undefined | null, userId: number): Promise<void> {
  if (workerId === undefined || workerId === null) return;

  const db = getDb();
  const [worker] = await db
    .select({ id: workers.id })
    .from(workers)
    .where(and(eq(workers.id, workerId), eq(workers.userId, userId)))
    .limit(1);

  if (!worker) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Worker not found",
    });
  }
}
