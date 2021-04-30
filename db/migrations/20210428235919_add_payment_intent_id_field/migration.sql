/*
  Warnings:

  - A unique constraint covering the columns `[paymentIntentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentIntentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentIntentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order.paymentIntentId_unique" ON "Order"("paymentIntentId");
