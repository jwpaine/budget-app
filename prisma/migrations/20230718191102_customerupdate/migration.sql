-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "subscriptionStatus" TEXT,
ALTER COLUMN "subscriptionId" DROP NOT NULL;
