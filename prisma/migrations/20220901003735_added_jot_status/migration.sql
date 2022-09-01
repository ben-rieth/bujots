-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'DELETED', 'ACTIVE');

-- AlterTable
ALTER TABLE "Jot" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
