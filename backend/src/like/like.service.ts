import { Injectable } from '@nestjs/common';
import { Like_Type, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type UpdateLikeInput = {
  targetId: number;
  type: Like_Type;
  userId: number;
};

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePostLike(input: UpdateLikeInput) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingLike = await tx.post_Like.findUnique({
          where: {
            userId_postId: { userId: input.userId, postId: input.targetId },
          },
        });

        // Clicking the existing action again cancels it.
        if (existingLike?.type === input.type) {
          await tx.post_Like.delete({
            where: {
              userId_postId: { userId: input.userId, postId: input.targetId },
            },
          });

          const post = await tx.post.update({
            where: { id: input.targetId },
            data: {
              likes: { increment: input.type === 'like' ? -1 : 1 },
            },
            select: { id: true, likes: true },
          });

          return { post };
        }

        if (!existingLike) {
          await tx.post_Like.create({
            data: {
              userId: input.userId,
              postId: input.targetId,
              type: input.type,
            },
          });

          const post = await tx.post.update({
            where: { id: input.targetId },
            data: {
              likes: { increment: input.type === 'like' ? 1 : -1 },
            },
            select: { id: true, likes: true },
          });

          return { post };
        }

        await tx.post_Like.update({
          where: {
            userId_postId: { userId: input.userId, postId: input.targetId },
          },
          data: { type: input.type },
        });

        const post = await tx.post.update({
          where: { id: input.targetId },
          data: {
            likes: { increment: input.type === 'like' ? 2 : -2 },
          },
          select: { id: true, likes: true },
        });

        return { post };
      });
    } catch (error) {
      // A concurrent duplicate insert loses the UNIQUE race. Its transaction
      // rolls back, so the winning request is the only one that changes likes.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {};
      }

      throw error;
    }
  }

  async updateCommentLike(input: UpdateLikeInput) {
    const existingLike = await this.prisma.comment_Like.findUnique({
      where: {
        userId_commentId: { userId: input.userId, commentId: input.targetId },
      },
    });

    //Like does not exist
    if (input.type === 'like') {
      //If user havent liked the post, we simply created a new like in the like table
      // with type == 'like'
      // and update #of likes for the target post
      if (!existingLike) {
        const result = await this.prisma.$transaction([
          this.prisma.comment_Like.create({
            data: {
              userId: input.userId,
              commentId: input.targetId,
              type: input.type,
            },
          }),
          this.prisma.comment.update({
            where: { id: input.targetId },
            data: {
              likes: {
                increment: 1,
              },
            },
          }),
        ]);

        return result;
      } else {
        const likeChange =
          existingLike.type === 'like' ? 'decrement' : 'increment';
        const result = await this.prisma.$transaction([
          this.prisma.comment_Like.delete({
            where: {
              userId_commentId: {
                commentId: input.targetId,
                userId: input.userId,
              },
            },
          }),
          this.prisma.comment.update({
            where: { id: input.targetId },
            data: {
              likes: {
                [likeChange]: 1,
              },
            },
          }),
        ]);

        return result;
      }
    }

    //when input type === 'dislike'
    else {
      if (!existingLike) {
        const result = await this.prisma.$transaction([
          this.prisma.comment_Like.create({
            data: {
              userId: input.userId,
              commentId: input.targetId,
              type: input.type,
            },
          }),
          this.prisma.comment.update({
            where: { id: input.targetId },
            data: {
              likes: {
                decrement: 1,
              },
            },
          }),
        ]);

        return result;
      }

      //similar logic applies like above
      else {
        const likeChange =
          existingLike.type === 'like' ? 'decrement' : 'increment';
        const result = await this.prisma.$transaction([
          this.prisma.comment_Like.delete({
            where: {
              userId_commentId: {
                commentId: input.targetId,
                userId: input.userId,
              },
            },
          }),
          this.prisma.comment.update({
            where: { id: input.targetId },
            data: {
              likes: {
                [likeChange]: 1,
              },
            },
          }),
        ]);

        return result;
      }
    }
  }
}
