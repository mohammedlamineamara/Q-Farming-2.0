import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",

  dbCredentials: {
    host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "2jsXDwK7JinTzy6.root",
    password: process.env.TIDB_PASSWORD!,
    database: "q_farming",

    ssl: {
      rejectUnauthorized: true,
    },
  },
});
