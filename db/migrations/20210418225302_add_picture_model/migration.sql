-- CreateTable
CREATE TABLE "Picture" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "designId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Picture" ADD FOREIGN KEY ("designId") REFERENCES "Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;
