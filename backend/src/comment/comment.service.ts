import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(authorId: number, dto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: {
        content: dto.content,
        authorId,
        postId: dto.postId,
      },
    });
  }

  async updateComment(
    commentId: number,
    loggedInUserId: number,
    dto: UpdateCommentDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== loggedInUserId) {
      throw new ForbiddenException('You cannot edit this comment');
    }

    await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: dto.content,
      },
    });

    return { message: 'Comment updated' };
  }

  async deleteComment(commentId: number, loggedInUserId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== loggedInUserId) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment deleted' };
  }
}
