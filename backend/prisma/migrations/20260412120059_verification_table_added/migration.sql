/*
  Warnings:

  - You are about to alter the column `type` on the `VerificationCode` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[userId,type]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `VerificationCode` MODIFY `type` ENUM('CHANGE_PASSWORD', 'EMAIL_VERIFY') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `VerificationCode_userId_type_key` ON `VerificationCode`(`userId`, `type`);

-- AddForeignKey
ALTER TABLE `VerificationCode` ADD CONSTRAINT `VerificationCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
