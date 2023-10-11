/*
  Warnings:

  - You are about to drop the column `score` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "score",
ADD COLUMN     "scoreUser1" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scoreUser2" INTEGER NOT NULL DEFAULT 0;
