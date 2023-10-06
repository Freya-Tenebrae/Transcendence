/*
  Warnings:

  - You are about to drop the `Security` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Security" DROP CONSTRAINT "Security_id_fkey";

-- DropTable
DROP TABLE "Security";

-- CreateTable
CREATE TABLE "Pass" (
    "salted_password" TEXT,
    "salt" TEXT,
    "id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pass_id_key" ON "Pass"("id");

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
