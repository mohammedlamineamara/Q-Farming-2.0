import { describe, expect, it } from "vitest";

process.env.APP_SECRET = "test-secret-q-farming-2026";

import { hashPassword, verifyPassword } from "./password";
import {
  signSessionToken,
  verifySessionToken,
} from "../kimi/session";

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
