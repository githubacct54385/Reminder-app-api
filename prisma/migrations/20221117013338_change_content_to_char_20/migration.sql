/*
  Warnings:

  - You are about to alter the column `content` on the `Reminder` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Char(20)`.

*/
-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "content" SET DATA TYPE CHAR(20);
