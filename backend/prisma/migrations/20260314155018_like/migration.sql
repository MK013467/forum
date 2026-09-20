/*
  Warnings:

  - Added the required column `type` to the `Post_Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `content` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `Post_Like` ADD COLUMN `type` ENUM('like', 'dislike') NOT NULL;
