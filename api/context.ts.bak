import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDb } from "./queries/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createContext(
  opts: FetchCreateContextFnOptions,
) {
  const db = getDb();

  const result = await db
    .select()
    .from(users)
    .where(eq(users.unionId, "admin"))
    .limit(1);

  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user: result[0] ?? null,
  };
}
