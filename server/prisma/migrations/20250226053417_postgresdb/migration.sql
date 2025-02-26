-- AlterTable
ALTER TABLE "Issuance" ALTER COLUMN "target_return_date" SET DEFAULT (CURRENT_TIMESTAMP + interval '7 days');
