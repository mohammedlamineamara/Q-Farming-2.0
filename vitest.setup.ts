process.env.NODE_ENV = "test";
process.env.APP_ID = "q-farming-test";
process.env.APP_SECRET = "q-farming-test-secret-2026";
// In the test runner, leave DATABASE_URL empty so getDb() uses the in-memory mock database
process.env.DATABASE_URL = "";
process.env.KIMI_AUTH_URL = "https://example.com";
process.env.KIMI_OPEN_URL = "https://example.com";
process.env.OWNER_UNION_ID = "test-owner";
