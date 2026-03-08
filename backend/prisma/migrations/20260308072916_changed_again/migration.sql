/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `VerificationCode` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `VerificationCode` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `createdAt`,
    ADD COLUMN `createsAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `VerificationCode` DROP COLUMN `createAt`,
    DROP COLUMN `expiredAt`,
    ADD COLUMN `createsAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
