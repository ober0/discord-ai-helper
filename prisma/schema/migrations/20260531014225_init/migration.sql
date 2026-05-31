-- CreateTable
CREATE TABLE "action_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "userDiscordId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "jsonData" TEXT NOT NULL,
    "usageId" INTEGER NOT NULL,
    "aiCalls" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "action_history_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "AiUsage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "inputCachedTokens" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "action_history_usageId_key" ON "action_history"("usageId");
