/*
  Warnings:

  - You are about to drop the column `date` on the `Jot` table. All the data in the column will be lost.
  - Added the required column `listId` to the `Jot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jot" DROP COLUMN "date",
ADD COLUMN     "listId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DailyList" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jot" ADD CONSTRAINT "Jot_listId_fkey" FOREIGN KEY ("listId") REFERENCES "DailyList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
