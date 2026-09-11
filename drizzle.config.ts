import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL?.trim();
const hasDatabaseUrl = Boolean(databaseUrl && !databaseUrl.startsWith("#"));

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",

  dbCredentials: hasDatabaseUrl
    ? {
        url: databaseUrl!,
      }
    : {
        host: process.env.DB_HOST || "gateway01.eu-central-1.prod.aws.tidbcloud.com",
        port: Number(process.env.DB_PORT || 4000),
        user: process.env.DB_USER || "2jsXDwK7JinTzy6.root",
        password: process.env.TIDB_PASSWORD || "",
        database: process.env.DB_NAME || "q_farming",

        ssl: {
          rejectUnauthorized: true,
        },
      },
});
