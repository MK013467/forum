-- Replace the existing equivalent constraint so Prisma exposes
-- the compound key as `userId_postId`.
DROP INDEX `Post_Like_postId_userId_key` ON `Post_Like`;

CREATE UNIQUE INDEX `Post_Like_userId_postId_key`
ON `Post_Like`(`userId`, `postId`);
