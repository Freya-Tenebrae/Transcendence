-- AlterTable
ALTER TABLE "Archivement" ALTER COLUMN "pathImg" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "pathImage" SET DEFAULT 'https://i.imgur.com/RDB9iMH.jpg';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pathAvatar" SET DEFAULT 'https://i.imgur.com/5T0p5kr.jpg';
