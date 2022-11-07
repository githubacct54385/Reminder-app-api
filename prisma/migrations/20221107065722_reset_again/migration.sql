/*
  Warnings:

  - Added the required column `created_at_utc` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at_utc" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at_utc" TIMESTAMP(3);
