import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('CommentService', () => {
  let service: CommentService;
  const mockPrismaService = {
    comment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const authorId = 1;
  const otherUserId = 2;
  const existingComment = { id: 10, authorId, postId: 5, content: 'hi' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateComment', () => {
    it('throws NotFoundException when the comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(
        service.updateComment(10, authorId, { content: 'new' }),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.comment.update).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when the user is not the author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(existingComment);

      const result = service.updateComment(10, otherUserId, { content: 'new' });

      await expect(result).rejects.toThrow(ForbiddenException);
      await expect(result).rejects.toThrow('You cannot edit this comment');
      expect(mockPrismaService.comment.update).not.toHaveBeenCalled();
    });

    it('updates the comment for its author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(existingComment);
      mockPrismaService.comment.update.mockResolvedValue({
        ...existingComment,
        content: 'new',
      });

      await expect(
        service.updateComment(10, authorId, { content: 'new' }),
      ).resolves.toEqual({ message: 'Comment updated' });
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { content: 'new' },
      });
    });
  });

  describe('deleteComment', () => {
    it('throws NotFoundException when the comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.deleteComment(10, authorId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.comment.delete).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when the user is not the author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(existingComment);

      await expect(service.deleteComment(10, otherUserId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.comment.delete).not.toHaveBeenCalled();
    });

    it('deletes the comment for its author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(existingComment);
      mockPrismaService.comment.delete.mockResolvedValue(existingComment);

      await expect(service.deleteComment(10, authorId)).resolves.toEqual({
        message: 'Comment deleted',
      });
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: 10 },
      });
    });
  });

  describe('createComment', () => {
    it('uses the given author id, not anything from the DTO', async () => {
      mockPrismaService.comment.create.mockResolvedValue(existingComment);

      await service.createComment(authorId, { postId: 5, content: 'hi' });

      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: { content: 'hi', authorId, postId: 5 },
      });
    });

    it('propagates database errors instead of returning undefined', async () => {
      mockPrismaService.comment.create.mockRejectedValue(new Error('db down'));

      await expect(
        service.createComment(authorId, { postId: 5, content: 'hi' }),
      ).rejects.toThrow('db down');
    });
  });
});
