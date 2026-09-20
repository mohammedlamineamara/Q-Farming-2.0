-- Q-Farming 2.0 - Phase 4
-- Auth provider separation: local vs Kimi
-- Applied manually to TiDB Cloud before this file was created.
-- Do not execute against an already-migrated database.

ALTER TABLE users
  ADD COLUMN authProvider ENUM('local','kimi') NOT NULL DEFAULT 'local',
  MODIFY COLUMN password VARCHAR(255) NULL;
