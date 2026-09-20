/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `embeddings` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_title_key` ON `Post`(`title`);

-- CreateIndex
CREATE INDEX `Post_createsAt_idx` ON `Post`(`createsAt`);

-- CreateIndex
CREATE INDEX `Post_views_idx` ON `Post`(`views`);

-- CreateIndex
CREATE INDEX `Post_likes_idx` ON `Post`(`likes`);

-- AddForeignKey
ALTER TABLE `Post_Like` ADD CONSTRAINT `Post_Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post_Like` ADD CONSTRAINT `Post_Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment_Like` ADD CONSTRAINT `Comment_Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment_Like` ADD CONSTRAINT `Comment_Like_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_authorId_fkey` TO `Post_authorId_idx`;
