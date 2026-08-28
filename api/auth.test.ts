import { describe, expect, it } from "vitest";

describe("Q-Farming 2.0 - Authentication", () => {
  it("should confirm the authentication module test environment works", () => {
    expect(true).toBe(true);
  });

  it("should validate a basic email format", () => {
    const email = "test@q-farming.com";

    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should reject an invalid email format", () => {
    const email = "invalid-email";

    expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
