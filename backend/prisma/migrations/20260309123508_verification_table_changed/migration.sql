/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VerificationCode` ADD COLUMN `requestNum` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatesAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `VerificationCode_userId_key` ON `VerificationCode`(`userId`);
