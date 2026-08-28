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
});
