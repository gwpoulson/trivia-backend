/*
  Warnings:

  - You are about to drop the column `roomCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `roomCode`,
    ADD COLUMN `roomCodeId` INTEGER NULL,
    ADD COLUMN `roomId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Room_roomCode_key`(`roomCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roomCodeId_fkey` FOREIGN KEY (`roomCodeId`) REFERENCES `Room`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
