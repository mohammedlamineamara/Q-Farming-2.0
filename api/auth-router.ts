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

export const authRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const existingUser = await findUserByEmail(input.email);

      if (existingUser) {
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
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const validPassword = await verifyPassword(
        input.password,
        user.password,
      );

      if (!validPassword) {
        throw new Error("Invalid email or password");
      }

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

  me: authedQuery.query((opts) => opts.ctx.user),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);

    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );

    return {
      success: true,
    };
  }),
});
