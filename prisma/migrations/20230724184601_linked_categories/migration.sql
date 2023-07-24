/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "accountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_categoryId_key" ON "Account"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_accountId_key" ON "Category"("accountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
