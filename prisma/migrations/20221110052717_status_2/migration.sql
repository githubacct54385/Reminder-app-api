/*
  Warnings:

  - You are about to drop the column `status` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "status",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
