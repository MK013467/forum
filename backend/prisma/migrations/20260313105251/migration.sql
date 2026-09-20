/*
  Warnings:

  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `content` VARCHAR(2000) NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `title` VARCHAR(300) NOT NULL,
    MODIFY `content` VARCHAR(10000) NULL;

-- DropTable
DROP TABLE `Like`;

-- CreateTable
CREATE TABLE `Post_Like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    UNIQUE INDEX `Post_Like_postId_userId_key`(`postId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment_Like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('like', 'dislike') NOT NULL,
    `userId` INTEGER NOT NULL,
    `commentId` INTEGER NOT NULL,

    UNIQUE INDEX `Comment_Like_userId_commentId_key`(`userId`, `commentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
