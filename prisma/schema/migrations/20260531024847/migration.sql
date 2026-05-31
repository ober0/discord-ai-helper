/*
  Warnings:

  - You are about to drop the column `action` on the `action_history` table. All the data in the column will be lost.
  - You are about to drop the column `jsonData` on the `action_history` table. All the data in the column will be lost.
  - You are about to alter the column `userDiscordId` on the `action_history` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `req` to the `action_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `res` to the `action_history` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_action_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "userDiscordId" INTEGER NOT NULL,
    "req" TEXT NOT NULL,
    "res" TEXT NOT NULL,
    "usageId" INTEGER NOT NULL,
    "aiCalls" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "action_history_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "ai_usage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_action_history" ("aiCalls", "createdAt", "id", "usageId", "userDiscordId", "userName") SELECT "aiCalls", "createdAt", "id", "usageId", "userDiscordId", "userName" FROM "action_history";
DROP TABLE "action_history";
ALTER TABLE "new_action_history" RENAME TO "action_history";
CREATE UNIQUE INDEX "action_history_usageId_key" ON "action_history"("usageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
