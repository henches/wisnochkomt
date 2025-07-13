-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expression" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'unknown',
    "info" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Expression" ("createdAt", "id", "info", "text") SELECT "createdAt", "id", "info", "text" FROM "Expression";
DROP TABLE "Expression";
ALTER TABLE "new_Expression" RENAME TO "Expression";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
