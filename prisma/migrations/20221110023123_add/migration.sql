/*
  Warnings:

  - You are about to drop the column `due_date_lead_hours` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "due_date_lead_hours",
ADD COLUMN     "due_date_alert" TEXT;
