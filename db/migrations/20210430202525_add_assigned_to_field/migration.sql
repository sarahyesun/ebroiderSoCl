-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "assignedToId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
