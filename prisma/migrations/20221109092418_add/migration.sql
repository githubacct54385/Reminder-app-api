/*
  Warnings:

  - You are about to drop the column `IsCompleted` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "IsCompleted",
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;
