CREATE INDEX `Post_Like_postId_idx` ON `Post_Like`(`postId`);

DROP INDEX `Post_Like_postId_userId_key` ON `Post_Like`;

CREATE UNIQUE INDEX `Post_Like_userId_postId_key`
ON `Post_Like`(`userId`, `postId`);