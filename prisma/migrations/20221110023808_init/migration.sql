/*
  Warnings:

  - Made the column `due_date_alert` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "due_date_alert" SET NOT NULL,
ALTER COLUMN "due_date_alert" SET DEFAULT 'None';
