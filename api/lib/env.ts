import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
  override: process.env.NODE_ENV !== "test",
});

function getEnv(name: string, fallback = ""): string {
  const value = process.env[name];
  return value || fallback;
}

const isProduction = process.env.NODE_ENV === "production";

const KNOWN_DEV_OR_PLACEHOLDER_SECRETS = new Set([
  "q-farming-secret-key-for-auth-tokens-32chars",
  "change-me",
  "default-secret",
  "placeholder",
  "your-secret-key-here",
  "your-secret-key-at-least-32-chars-long",
  "12345678901234567890123456789012",
]);

export function validateAppSecret(
  customEnv?: Record<string, string | undefined>,
  devFallback: string = "q-farming-secret-key-for-auth-tokens-32chars"
): string {
  const envSource = customEnv || process.env;
  const isProd = (customEnv ? customEnv.NODE_ENV : process.env.NODE_ENV) === "production";
  const raw = envSource.APP_SECRET;

  if (isProd) {
    if (!raw || !raw.trim()) {
      throw new Error("Production configuration error: APP_SECRET is required but not configured");
    }
    const trimmed = raw.trim();
    if (trimmed.length < 32) {
      throw new Error("Production configuration error: APP_SECRET must be at least 32 characters in production");
    }
    const lower = trimmed.toLowerCase();
    if (
      KNOWN_DEV_OR_PLACEHOLDER_SECRETS.has(lower) ||
      lower.includes("change-me") ||
      lower.includes("placeholder")
    ) {
      throw new Error("Production configuration error: APP_SECRET cannot use default or placeholder values in production");
    }
    return trimmed;
  }

  return raw?.trim() || devFallback;
}

export function getRequiredInProduction(
  name: string,
  devFallback: string,
  customEnv?: Record<string, string | undefined>
): string {
  if (name === "APP_SECRET") {
    return validateAppSecret(customEnv, devFallback);
  }
  const envSource = customEnv || process.env;
  const isProd = (customEnv ? customEnv.NODE_ENV : process.env.NODE_ENV) === "production";
  const value = envSource[name];
  if (isProd) {
    if (!value || !value.trim()) {
      throw new Error(`Production configuration error: ${name} is required but not configured`);
    }
    return value.trim();
  }
  return value?.trim() || devFallback;
}

export function validateProductionDatabaseUrl(
  customEnv?: Record<string, string | undefined>
): string {
  const envSource = customEnv || process.env;
  const isProd = (customEnv ? customEnv.NODE_ENV : process.env.NODE_ENV) === "production";
  const raw = envSource.DATABASE_URL?.trim();
  if (isProd) {
    if (!raw || raw.startsWith("#")) {
      throw new Error("Production configuration error: DATABASE_URL is required but not configured");
    }
    return raw;
  }
  if (!raw || raw.startsWith("#")) {
    return "";
  }
  return raw;
}

function getSanitizedDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw || raw.startsWith("#")) {
    return "";
  }
  return raw;
}

export const env = {
  appId: getEnv("APP_ID", "q-farming-app"),
  appSecret: getRequiredInProduction("APP_SECRET", "q-farming-secret-key-for-auth-tokens-32chars"),

  isProduction,

  databaseUrl: getSanitizedDatabaseUrl(),

  // Kimi OAuth is optional for local development.
  kimiAuthUrl: process.env.KIMI_AUTH_URL ?? "",
  kimiOpenUrl: process.env.KIMI_OPEN_URL ?? "",

  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
