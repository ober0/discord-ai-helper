/*
  Warnings:

  - You are about to drop the `AiUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AiUsage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ai_usage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "inputCachedTokens" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_action_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "userDiscordId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "jsonData" TEXT NOT NULL,
    "usageId" INTEGER NOT NULL,
    "aiCalls" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "action_history_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "ai_usage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_action_history" ("action", "aiCalls", "createdAt", "id", "jsonData", "usageId", "userDiscordId", "userName") SELECT "action", "aiCalls", "createdAt", "id", "jsonData", "usageId", "userDiscordId", "userName" FROM "action_history";
DROP TABLE "action_history";
ALTER TABLE "new_action_history" RENAME TO "action_history";
CREATE UNIQUE INDEX "action_history_usageId_key" ON "action_history"("usageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
