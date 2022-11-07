/*
  Warnings:

  - You are about to drop the column `Content` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `DueDate` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `DueDateLeadHours` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `content` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at_utc` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date_utc` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "Content",
DROP COLUMN "DueDate",
DROP COLUMN "DueDateLeadHours",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "created_at_utc" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "due_date_lead_hours" INTEGER,
ADD COLUMN     "due_date_utc" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at_utc" TIMESTAMP(3);
