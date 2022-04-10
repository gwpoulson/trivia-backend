/*
  Warnings:

  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `roomId`,
    MODIFY `score` INTEGER NOT NULL DEFAULT 0;
