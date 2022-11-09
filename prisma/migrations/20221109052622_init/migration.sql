/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creator_email` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_creator_id_fkey";

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "creator_email" TEXT NOT NULL,
ADD COLUMN     "creator_name" TEXT;

-- DropTable
DROP TABLE "User";
