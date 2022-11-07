-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "DueDateLeadHours" DROP NOT NULL;
