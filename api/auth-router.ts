import * as cookie from "cookie";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { createUser, findUserByEmail } from "./queries/users";
import { signSessionToken } from "./kimi/session";
import { env } from "./lib/env";
import {
  hashPassword,
  verifyPassword,
} from "./auth/password";
import {
  rateLimiter,
  getClientIdentifier,
  AUTH_RATE_LIMIT_CONFIGS,
} from "./lib/rate-limit";

export const authRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2).max(100),
        email: z.string().email().max(255),
        password: z.string().min(6).max(128),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const clientId = getClientIdentifier(ctx.req, "reg");
      rateLimiter.assertAllowed(clientId, AUTH_RATE_LIMIT_CONFIGS.register);

      const existingUser = await findUserByEmail(input.email);

      if (existingUser) {
        // Record rate limit attempt to deter account enumeration
        rateLimiter.recordFailure(clientId, AUTH_RATE_LIMIT_CONFIGS.register);
        throw new Error("Email already exists");
      }

      const passwordHash = await hashPassword(input.password);

      await createUser({
        unionId: input.email,
        name: input.name,
        email: input.email,
        password: passwordHash,
        role: "worker",
      });

      return {
        success: true,
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email().max(255),
        password: z.string().min(6).max(128),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const clientId = getClientIdentifier(ctx.req, "login");
      rateLimiter.assertAllowed(clientId, AUTH_RATE_LIMIT_CONFIGS.login);

      const user = await findUserByEmail(input.email);

      if (!user) {
        rateLimiter.recordFailure(clientId, AUTH_RATE_LIMIT_CONFIGS.login);
        throw new Error("Invalid email or password");
      }

      const validPassword = await verifyPassword(
        input.password,
        user.password,
      );

      if (!validPassword) {
        rateLimiter.recordFailure(clientId, AUTH_RATE_LIMIT_CONFIGS.login);
        throw new Error("Invalid email or password");
      }

      // Successful login resets rate limit counter for this client
      rateLimiter.reset(clientId);

      const token = await signSessionToken({
        unionId: user.unionId,
        clientId: env.appId,
      });

      const cookieOpts = getSessionCookieOptions(ctx.req.headers);

      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }),

  me: authedQuery.query((opts) => {
    if (!opts.ctx.user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = opts.ctx.user;
    return safeUser;
  }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);

    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "logged_out", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 86400,
      }),
    );

    return {
      success: true,
    };
  }),
});
