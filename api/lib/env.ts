import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
  override: true,
});

function getEnv(name: string, fallback = ""): string {
  const value = process.env[name];
  return value || fallback;
}

const isProduction = process.env.NODE_ENV === "production";

function getRequiredInProduction(name: string, devFallback: string): string {
  const value = process.env[name];
  if (isProduction) {
    if (!value || !value.trim()) {
      throw new Error(`Production configuration error: ${name} is required but not configured`);
    }
    return value.trim();
  }
  return value?.trim() || devFallback;
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
