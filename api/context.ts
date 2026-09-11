import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { authenticateRequest } from "./kimi/auth";
import { findUserByUnionId } from "./queries/users";

export async function createContext(
  opts: FetchCreateContextFnOptions,
) {
  let user = null;
  const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
  const token = cookies[Session.cookieName];

  if (token && token !== "logged_out") {
    try {
      user = await authenticateRequest(opts.req.headers);
    } catch {
      user = null;
    }
  }

  // Fall back to demo user if no token exists (e.g. preview environment)
  if (!user && !token) {
    user = (await findUserByUnionId("demo-user")) ?? null;
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
