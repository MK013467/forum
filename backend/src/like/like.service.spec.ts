import { Like_Type } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeService } from './like.service';

describe('LikeService', () => {
  const transaction = {
    post_Like: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    post: {
      update: jest.fn(),
    },
  };

  const prisma = {
    $transaction: jest.fn(),
  } as unknown as PrismaService;

  let service: LikeService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new LikeService(prisma);

    (prisma.$transaction as jest.Mock).mockImplementation(
      (callback: (client: typeof transaction) => unknown) =>
        callback(transaction),
    );
  });

  it('creates the reaction and increments the post in one transaction', async () => {
    transaction.post_Like.findUnique.mockResolvedValue(null);
    transaction.post_Like.create.mockResolvedValue({});
    transaction.post.update.mockResolvedValue({ id: 10, likes: 1 });

    await expect(
      service.updatePostLike({
        userId: 1,
        targetId: 10,
        type: Like_Type.like,
      }),
    ).resolves.toEqual({ changed: true, post: { id: 10, likes: 1 } });

    expect(transaction.post_Like.create).toHaveBeenCalledWith({
      data: { userId: 1, postId: 10, type: Like_Type.like },
    });
    expect(transaction.post.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { likes: { increment: 1 } },
      select: { id: true, likes: true },
    });
  });

  it('cancels an existing like and decrements the post count', async () => {
    transaction.post_Like.findUnique.mockResolvedValue({ type: Like_Type.like });
    transaction.post_Like.delete.mockResolvedValue({});
    transaction.post.update.mockResolvedValue({ id: 10, likes: 0 });

    await expect(
      service.updatePostLike({
        userId: 1,
        targetId: 10,
        type: Like_Type.like,
      }),
    ).resolves.toEqual({ changed: true, post: { id: 10, likes: 0 } });

    expect(transaction.post_Like.create).not.toHaveBeenCalled();
    expect(transaction.post_Like.delete).toHaveBeenCalledWith({
      where: { userId_postId: { userId: 1, postId: 10 } },
    });
    expect(transaction.post.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { likes: { increment: -1 } },
      select: { id: true, likes: true },
    });
  });
});
