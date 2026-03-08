/*
  Warnings:

  - You are about to drop the `VerifciatonCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `VerifciatonCode`;

-- CreateTable
CREATE TABLE `VerificatonCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
