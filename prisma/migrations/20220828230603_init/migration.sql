-- CreateEnum
CREATE TYPE "Type" AS ENUM ('TASK', 'EVENT', 'NOTE');

-- CreateTable
CREATE TABLE "Jot" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "important" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jot_pkey" PRIMARY KEY ("id")
);
