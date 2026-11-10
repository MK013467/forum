import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PostService', () => {
  let postService: PostService;
  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    },

    comment: {
      deleteMany: jest.fn(),
    },

    post_Like: {
      deleteMany: jest.fn(),
    },

    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  afterEach(() => jest.clearAllMocks());

  // Did not test the simple Prisma logic since Prisma is already established library

  describe('delete Post', () => {
    //update suc
    it('delete success', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        title: 'title',
        content: 'content',
        authorId: 1,
      });
      mockPrismaService.$transaction.mockResolvedValue([]);

      await expect(postService.deletePost(1, 1)).resolves.toBeUndefined();
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('delete post throwing error for non existing postId', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);
      await expect(postService.deletePost(1, 2)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('delete post throwing error for authorId != request userId', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        title: 'title',
        content: 'content',
        authorId: 1,
      });
      await expect(postService.deletePost(1, 2)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('create Post', () => {
    it('creates a post with a new title', async () => {
      const created = { id: 1, title: 'new', content: 'c', authorId: 7 };
      mockPrismaService.post.create.mockResolvedValue(created);

      const result = await postService.createPost(
        { title: 'new', content: 'c' },
        7,
      );

      expect(result).toEqual(created);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: { title: 'new', content: 'c', authorId: 7 },
      });
    });

    it('throws ConflictException when the title is taken (P2002)', async () => {
      mockPrismaService.post.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(
        postService.createPost({ title: 'dup', content: 'c' }, 7),
      ).rejects.toThrow(ConflictException);
    });

    it('rethrows other database errors', async () => {
      mockPrismaService.post.create.mockRejectedValue(new Error('db down'));

      await expect(
        postService.createPost({ title: 't', content: 'c' }, 7),
      ).rejects.toThrow('db down');
    });
  });

  describe('update Post', () => {
    it('throws NotFoundException for a missing post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(
        postService.updatePost(1, { title: 't' }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for another user', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 1,
      });

      await expect(
        postService.updatePost(1, { title: 't' }, 2),
      ).rejects.toThrow(ForbiddenException);
    });

    it('only writes title and content, even if the body has more', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue({
        id: 1,
        authorId: 1,
      });
      const body = { title: 't', content: 'c', likes: 9999, authorId: 2 };

      await postService.updatePost(1, body, 1);

      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 't', content: 'c' },
      });
    });
  });
});
