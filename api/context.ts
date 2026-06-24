import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authenticateRequest } from "./kimi/auth";

export async function createContext(
  opts: FetchCreateContextFnOptions,
) {
  let user = null;

  try {
    user = await authenticateRequest(opts.req.headers);
  } catch {
    user = null;
  }

  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
    user,
  };
}

export type TrpcContext = Awaited<
  ReturnType<typeof createContext>
>;
