import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { Session } from "@contracts/constants";

process.env.APP_SECRET = "test-secret-q-farming-2026";

import { hashPassword, verifyPassword } from "./password";
import {
  signSessionToken,
  verifySessionToken,
} from "../kimi/session";
import * as schema from "../../db/schema";
import { authRouter } from "../auth-router";
import * as userQueries from "../queries/users";
import type { TrpcContext } from "../context";

describe("Q-Farming 2.0 - Password Security", () => {
  it("should hash a password", async () => {
    const password = "TestPassword123";

    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it("should verify the correct password", async () => {
    const password = "TestPassword123";
    const hash = await hashPassword(password);

    await expect(
      verifyPassword(password, hash),
    ).resolves.toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const hash = await hashPassword("CorrectPassword123");

    await expect(
      verifyPassword("WrongPassword123", hash),
    ).resolves.toBe(false);
  });
});

describe("Q-Farming 2.0 - JWT Session", () => {
  it("should create and verify a session token", async () => {
    const payload = {
      unionId: "test-user-001",
      clientId: "q-farming-test",
    };

    const token = await signSessionToken(payload);

    expect(token).toBeDefined();
    expect(token.split(".")).toHaveLength(3);

    const verified = await verifySessionToken(token);

    expect(verified).toEqual(payload);
  });

  it("should reject an invalid JWT", async () => {
    const result = await verifySessionToken(
      "invalid.jwt.token",
    );

    expect(result).toBeNull();
  });

  it("should reject an empty JWT", async () => {
    const result = await verifySessionToken("");

    expect(result).toBeNull();
  });

  it("should invalidate session when APP_SECRET is changed (secret rotation)", async () => {
    const payload = {
      unionId: "rotation-user-001",
      clientId: "q-farming-test",
    };

    const token = await signSessionToken(payload);
    expect(token).toBeDefined();

    // Verify token works with current secret
    const valid = await verifySessionToken(token);
    expect(valid).toEqual(payload);

    // Simulate secret rotation with a new secret
    const { env } = await import("../lib/env");
    const originalSecret = env.appSecret;
    try {
      env.appSecret = "rotated-new-secret-key-32characters!";
      const afterRotation = await verifySessionToken(token);
      expect(afterRotation).toBeNull();
    } finally {
      env.appSecret = originalSecret;
    }
  });
});

describe("Q-Farming 2.0 - Production Environment Security Regression", () => {
  it("should throw a configuration error if APP_SECRET is missing in production", async () => {
    const { getRequiredInProduction } = await import("../lib/env");
    expect(() => {
      getRequiredInProduction("APP_SECRET", "dev-fallback", {
        NODE_ENV: "production",
        APP_SECRET: "",
      });
    }).toThrow("Production configuration error: APP_SECRET is required but not configured");
  });

  it("should throw a configuration error if APP_SECRET is whitespace in production", async () => {
    const { getRequiredInProduction } = await import("../lib/env");
    expect(() => {
      getRequiredInProduction("APP_SECRET", "dev-fallback", {
        NODE_ENV: "production",
        APP_SECRET: "   ",
      });
    }).toThrow("Production configuration error: APP_SECRET is required but not configured");
  });

  it("should throw a configuration error if APP_SECRET is shorter than 32 characters in production", async () => {
    const { getRequiredInProduction } = await import("../lib/env");
    expect(() => {
      getRequiredInProduction("APP_SECRET", "dev-fallback", {
        NODE_ENV: "production",
        APP_SECRET: "too-short-secret-key-12345",
      });
    }).toThrow("Production configuration error: APP_SECRET must be at least 32 characters in production");
  });

  it("should reject known development or placeholder APP_SECRET in production", async () => {
    const { getRequiredInProduction } = await import("../lib/env");
    expect(() => {
      getRequiredInProduction("APP_SECRET", "dev-fallback", {
        NODE_ENV: "production",
        APP_SECRET: "q-farming-secret-key-for-auth-tokens-32chars",
      });
    }).toThrow("Production configuration error: APP_SECRET cannot use default or placeholder values in production");

    expect(() => {
      getRequiredInProduction("APP_SECRET", "dev-fallback", {
        NODE_ENV: "production",
        APP_SECRET: "change-me-to-a-very-long-production-key-here",
      });
    }).toThrow("Production configuration error: APP_SECRET cannot use default or placeholder values in production");
  });

  it("should accept valid APP_SECRET in production without fallback", async () => {
    const { getRequiredInProduction } = await import("../lib/env");
    const secret = getRequiredInProduction("APP_SECRET", "dev-fallback", {
      NODE_ENV: "production",
      APP_SECRET: "my-super-secret-production-key-value",
    });
    expect(secret).toBe("my-super-secret-production-key-value");
  });

  it("should allow development fallback when not in production", async () => {
    const { getRequiredInProduction } = await import("../lib/env");
    const secret = getRequiredInProduction("APP_SECRET", "dev-fallback-secret", {
      NODE_ENV: "development",
      APP_SECRET: "",
    });
    expect(secret).toBe("dev-fallback-secret");
  });

  it("should throw a configuration error if DATABASE_URL is missing in production", async () => {
    const { validateProductionDatabaseUrl } = await import("../lib/env");
    expect(() => {
      validateProductionDatabaseUrl({
        NODE_ENV: "production",
        DATABASE_URL: "",
      });
    }).toThrow("Production configuration error: DATABASE_URL is required but not configured");
  });

  it("should throw a configuration error if DATABASE_URL is commented out in production", async () => {
    const { validateProductionDatabaseUrl } = await import("../lib/env");
    expect(() => {
      validateProductionDatabaseUrl({
        NODE_ENV: "production",
        DATABASE_URL: "# mysql://user:pass@localhost:3306/db",
      });
    }).toThrow("Production configuration error: DATABASE_URL is required but not configured");
  });
});

describe("Q-Farming 2.0 - Auth Provider Hardening (Phase 4 Option B)", () => {
  it("never passes null, undefined, empty, or whitespace to bcrypt.hash", async () => {
    const hashSpy = vi.spyOn(bcrypt, "hash");

    await expect(hashPassword(null as unknown as string)).rejects.toThrow(
      "Password must be a non-empty string for hashing",
    );
    await expect(hashPassword(undefined as unknown as string)).rejects.toThrow(
      "Password must be a non-empty string for hashing",
    );
    await expect(hashPassword("")).rejects.toThrow(
      "Password must be a non-empty string for hashing",
    );
    await expect(hashPassword("   \t\n  ")).rejects.toThrow(
      "Password must be a non-empty string for hashing",
    );

    // bcrypt.hash must NEVER have been called for these invalid attempts
    expect(hashSpy).not.toHaveBeenCalled();

    // Valid call invokes bcrypt.hash
    const validHash = await hashPassword("ValidPassword123!");
    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(validHash).toBeDefined();

    hashSpy.mockRestore();
  });

  it("never passes null, undefined, empty, or whitespace to bcrypt.compare", async () => {
    const compareSpy = vi.spyOn(bcrypt, "compare");
    const validHash = await hashPassword("ValidPassword123!");
    compareSpy.mockClear();

    // Invalid password parameter
    expect(await verifyPassword(null, validHash)).toBe(false);
    expect(await verifyPassword(undefined, validHash)).toBe(false);
    expect(await verifyPassword("", validHash)).toBe(false);
    expect(await verifyPassword("   ", validHash)).toBe(false);

    // Invalid hash parameter
    expect(await verifyPassword("ValidPassword123!", null)).toBe(false);
    expect(await verifyPassword("ValidPassword123!", undefined)).toBe(false);
    expect(await verifyPassword("ValidPassword123!", "")).toBe(false);
    expect(await verifyPassword("ValidPassword123!", "   ")).toBe(false);

    // Both invalid
    expect(await verifyPassword(null, null)).toBe(false);
    expect(await verifyPassword(undefined, undefined)).toBe(false);
    expect(await verifyPassword("", "")).toBe(false);

    // Verify bcrypt.compare was NEVER called during any of the above
    expect(compareSpy).not.toHaveBeenCalled();

    // Valid comparison correctly invokes bcrypt.compare
    const matches = await verifyPassword("ValidPassword123!", validHash);
    expect(matches).toBe(true);
    expect(compareSpy).toHaveBeenCalledTimes(1);

    compareSpy.mockRestore();
  });

  it("schema enforces authProvider enum ('local' | 'kimi') with default 'local' and nullable password", () => {
    expect(schema.users.password.notNull).toBe(false);
    expect(schema.users.authProvider).toBeDefined();
    expect(schema.users.authProvider.enumValues).toEqual(["local", "kimi"]);
    expect(schema.users.authProvider.default).toBe("local");
  });

  it("registration sets authProvider to 'local' for local accounts", async () => {
    const createUserSpy = vi.spyOn(userQueries, "createUser").mockResolvedValue(undefined as never);
    const findUserSpy = vi.spyOn(userQueries, "findUserByEmail").mockResolvedValue(undefined as never);

    const caller = authRouter.createCaller({
      req: new Request("http://localhost/api/trpc", {
        headers: new Headers({ "x-forwarded-for": "192.168.1.101" }),
      }),
      resHeaders: new Headers(),
      user: null,
    } as unknown as TrpcContext);

    const result = await caller.register({
      name: "Local Farmer",
      email: "local.farmer@q-farming.com",
      password: "StrongPassword123!",
    });

    expect(result).toEqual({ success: true });
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    const createdData = createUserSpy.mock.calls[0][0];
    expect(createdData.authProvider).toBe("local");
    expect(createdData.email).toBe("local.farmer@q-farming.com");
    expect(createdData.password).toBeDefined();
    expect(createdData.password).not.toBe("StrongPassword123!"); // Must be hashed

    createUserSpy.mockRestore();
    findUserSpy.mockRestore();
  });

  it("local login rejects Kimi accounts and never calls bcrypt", async () => {
    const compareSpy = vi.spyOn(bcrypt, "compare");
    const kimiUser = {
      id: 42,
      unionId: "kimi_oauth_user_42",
      name: "Kimi User",
      avatar: "https://avatar.kimi.moonshot.cn/42",
      email: "kimi.user@moonshot.cn",
      password: null, // Kimi accounts have no local password
      authProvider: "kimi" as const,
      role: "worker" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    };

    const findUserSpy = vi.spyOn(userQueries, "findUserByEmail").mockResolvedValue(kimiUser as never);

    const caller = authRouter.createCaller({
      req: new Request("http://localhost/api/trpc", {
        headers: new Headers({ "x-forwarded-for": "192.168.1.102" }),
      }),
      resHeaders: new Headers(),
      user: null,
    } as unknown as TrpcContext);

    await expect(
      caller.login({
        email: "kimi.user@moonshot.cn",
        password: "SomePassword123",
      }),
    ).rejects.toThrow("Invalid email or password");

    // Ensure bcrypt was NEVER invoked for the Kimi user
    expect(compareSpy).not.toHaveBeenCalled();

    compareSpy.mockRestore();
    findUserSpy.mockRestore();
  });

  it("local login rejects local account with missing or null password and never calls bcrypt", async () => {
    const compareSpy = vi.spyOn(bcrypt, "compare");
    const brokenUser = {
      id: 43,
      unionId: "local_nopw_43",
      name: "No Password User",
      avatar: null,
      email: "nopw@q-farming.com",
      password: null, // Null password
      authProvider: "local" as const,
      role: "worker" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    };

    const findUserSpy = vi.spyOn(userQueries, "findUserByEmail").mockResolvedValue(brokenUser as never);

    const caller = authRouter.createCaller({
      req: new Request("http://localhost/api/trpc", {
        headers: new Headers({ "x-forwarded-for": "192.168.1.103" }),
      }),
      resHeaders: new Headers(),
      user: null,
    } as unknown as TrpcContext);

    await expect(
      caller.login({
        email: "nopw@q-farming.com",
        password: "SomePassword123",
      }),
    ).rejects.toThrow("Invalid email or password");

    expect(compareSpy).not.toHaveBeenCalled();

    compareSpy.mockRestore();
    findUserSpy.mockRestore();
  });

  it("local login succeeds for valid local account and returns authProvider='local'", async () => {
    const hashedPassword = await hashPassword("MyValidPass123!");
    const localUser = {
      id: 44,
      unionId: "local_valid_44",
      name: "Valid Farmer",
      avatar: null,
      email: "valid.farmer@q-farming.com",
      password: hashedPassword,
      authProvider: "local" as const,
      role: "worker" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    };

    const findUserSpy = vi.spyOn(userQueries, "findUserByEmail").mockResolvedValue(localUser as never);

    const resHeaders = new Headers();
    const caller = authRouter.createCaller({
      req: new Request("http://localhost/api/trpc", {
        headers: new Headers({ "x-forwarded-for": "192.168.1.104" }),
      }),
      resHeaders,
      user: null,
    } as unknown as TrpcContext);

    const result = await caller.login({
      email: "valid.farmer@q-farming.com",
      password: "MyValidPass123!",
    });

    expect(result.success).toBe(true);
    expect(result.user.authProvider).toBe("local");
    expect(result.user.email).toBe("valid.farmer@q-farming.com");
    expect((result.user as Record<string, unknown>).password).toBeUndefined(); // Password is not exposed
    expect(resHeaders.get("set-cookie")).toContain(`${Session.cookieName}=`);

    findUserSpy.mockRestore();
  });

  it("local login rejects wrong password for local account", async () => {
    const hashedPassword = await hashPassword("MyValidPass123!");
    const localUser = {
      id: 45,
      unionId: "local_valid_45",
      name: "Valid Farmer 2",
      avatar: null,
      email: "valid.farmer2@q-farming.com",
      password: hashedPassword,
      authProvider: "local" as const,
      role: "worker" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: new Date(),
    };

    const findUserSpy = vi.spyOn(userQueries, "findUserByEmail").mockResolvedValue(localUser as never);

    const caller = authRouter.createCaller({
      req: new Request("http://localhost/api/trpc", {
        headers: new Headers({ "x-forwarded-for": "192.168.1.105" }),
      }),
      resHeaders: new Headers(),
      user: null,
    } as unknown as TrpcContext);

    await expect(
      caller.login({
        email: "valid.farmer2@q-farming.com",
        password: "WrongPassword999!",
      }),
    ).rejects.toThrow("Invalid email or password");

    findUserSpy.mockRestore();
  });

  it("me query strips password while preserving authProvider and role", async () => {
    const caller = authRouter.createCaller({
      req: new Request("http://localhost/api/trpc"),
      resHeaders: new Headers(),
      user: {
        id: 50,
        unionId: "u_50",
        name: "Test User",
        avatar: null,
        email: "test50@q-farming.com",
        password: "hashed_secret_password",
        authProvider: "local",
        role: "farm_manager",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignInAt: new Date(),
      },
    } as unknown as TrpcContext);

    const me = await caller.me();
    expect(me).not.toBeNull();
    expect((me as Record<string, unknown>).password).toBeUndefined();
    expect(me?.authProvider).toBe("local");
    expect(me?.role).toBe("farm_manager");
  });
});
