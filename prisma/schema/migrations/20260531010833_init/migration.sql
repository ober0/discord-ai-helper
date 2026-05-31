-- CreateTable
CREATE TABLE "action_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "userDiscordId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "jsonData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
