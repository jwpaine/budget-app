-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
