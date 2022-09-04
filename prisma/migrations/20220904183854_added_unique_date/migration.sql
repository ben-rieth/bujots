/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `DailyList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyList_date_key" ON "DailyList"("date");
