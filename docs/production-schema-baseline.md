# Production Schema Baseline

## Verification Status

- **Production Database**: TiDB Cloud
- **Database Name**: `q_farming`
- **Domain Tables**: 12 tables
  - `users`
  - `settings`
  - `fields`
  - `harvests`
  - `sales`
  - `inventory_items`
  - `sensors`
  - `workers`
  - `activities`
  - `ai_insights`
  - `calendar_events`
  - `notifications`
- **Domain Columns**: 120 domain-table columns verified across all 12 tables
- **Row Count**: 0 rows across all 12 domain tables at the time of verification
- **Repaired Indexes / Constraints**: 13/13 present and verified in `information_schema.STATISTICS`
- **Production Integration**: Passed
- **Test Suite**: 35/35 tests passed
- **Type Check**: Passed (`npm run check`)
- **Build**: Passed (`npm run build`)
- **Lint**: Passed (`npm run lint`)

---

## Schema Source

- `db/schema.ts` is the application schema source of truth.
- `drizzle/meta/0000_snapshot.json` matches `db/schema.ts` with zero schema drift.
- Production table/column structure matches the verified schema definition.
- The snapshot accurately contains all 13 relevant index and unique constraint definitions.

---

## Production Index Repair

The following 13 schema objects were successfully verified and applied to production during Phase 4J:

1. `users_email_unique` — Unique index on `users(email)`
2. `users_unionId_unique` — Unique constraint on `users(unionId)`
3. `settings_userId_unique` — Unique constraint on `settings(userId)`
4. `fields_user_id_idx` — Index on `fields(userId)`
5. `harvests_user_field_idx` — Composite index on `harvests(userId, fieldId)`
6. `sales_user_harvest_idx` — Composite index on `sales(userId, harvestId)`
7. `inventory_items_user_id_idx` — Index on `inventory_items(userId)`
8. `sensors_user_field_idx` — Composite index on `sensors(userId, fieldId)`
9. `workers_user_id_idx` — Index on `workers(userId)`
10. `activities_user_created_idx` — Composite index on `activities(userId, createdAt)`
11. `ai_insights_user_cat_idx` — Composite index on `ai_insights(userId, category)`
12. `calendar_events_user_date_idx` — Composite index on `calendar_events(userId, eventDate)`
13. `notifications_user_read_idx` — Composite index on `notifications(userId, read)`

These objects were applied safely and idempotently in Phase 4J using the dedicated allow-listed production index repair runner (`api/db/index-repair-runner.ts`).

---

## Migration History Note

- `drizzle/meta/_journal.json` contains the initial `0000_strange_shiva` baseline entry (`when: 1788007913435`).
- `drizzle/meta/0000_snapshot.json` exists and matches `db/schema.ts`.
- `drizzle/0000_strange_shiva.sql` is currently missing/absent from the workspace.
- `drizzle/0001_repair_indexes.sql` was intentionally deleted to prevent duplicate index creation.
- The remote `__drizzle_migrations` table records the existing initial migration hash (`3ee7b079724228b8f988ea6bacc1b0edc5db781a56c662b5091cc49ac2d393ec`).
- **The production repair was already executed successfully in Phase 4J.**
- **The 13 repair statements must NOT be replayed.**
- The deleted `0001_repair_indexes.sql` file must NOT be restored as an active Drizzle migration.
- Current production migration history must not be modified.

---

## Important Operational Rule

**DO NOT run:**
- `npm run db:migrate`
- `npm run db:push`

against the current production database as a mechanism to reconcile migration history.

Any future migration-history reconciliation must first be formally designed and reviewed separately.

---

## Reproducibility Note

- The application runtime is healthy and operating normally against the production database.
- `db/schema.ts` and `drizzle/meta/0000_snapshot.json` accurately describe the live schema.
- A completely empty database cannot currently be initialized from scratch via `drizzle-kit migrate` because `0000_strange_shiva.sql` is absent.
- **This is a migration-history reproducibility issue, NOT a production runtime issue.**

---

## Phase 4J Record

- 13/13 repair statements succeeded.
- 0 failures.
- No production data was created or modified.
- No migration history was changed.
- Post-repair verification passed with 100% confirmation across all statistics and schema tables.
