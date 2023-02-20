/*
  Warnings:

  - You are about to drop the column `authorId` on the `Bookmark` table. All the data in the column will be lost.
  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_authorId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hash" TEXT NOT NULL;
