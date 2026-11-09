import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    comment_Like: { deleteMany: jest.fn() },
    comment: { deleteMany: jest.fn() },
    post_Like: { deleteMany: jest.fn() },
    post: { deleteMany: jest.fn() },
    user: { delete: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteUser', () => {
    it('propagates a failed transaction instead of returning undefined', async () => {
      mockPrismaService.$transaction.mockRejectedValue(
        new Error('FK violation'),
      );

      await expect(service.deleteUser(1)).rejects.toThrow('FK violation');
    });

    it('runs every delete, user last, inside one transaction', async () => {
      // Each delete returns a distinct marker so we can check that the exact
      // operations, in this order, were handed to $transaction.
      mockPrismaService.comment_Like.deleteMany.mockReturnValue('commentLikes');
      mockPrismaService.comment.deleteMany.mockReturnValue('comments');
      mockPrismaService.post_Like.deleteMany.mockReturnValue('postLikes');
      mockPrismaService.post.deleteMany.mockReturnValue('posts');
      mockPrismaService.user.delete.mockReturnValue('user');
      mockPrismaService.$transaction.mockResolvedValue([]);

      await service.deleteUser(1);

      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        'commentLikes',
        'comments',
        'postLikes',
        'posts',
        'user',
      ]);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
