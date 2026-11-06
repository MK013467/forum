import { Like_Type, PrismaClient } from '@prisma/client';
import { LikeService } from '../src/like/like.service';
import { PrismaService } from '../src/prisma/prisma.service';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl || !new URL(testDatabaseUrl).pathname.endsWith('_test')) {
  throw new Error(
    'TEST_DATABASE_URL must point to a database ending in "_test".',
  );
}

describe('LikeService integration', () => {
  const prisma = new PrismaClient({
    datasources: { db: { url: testDatabaseUrl } },
  });
  const likeService = new LikeService(prisma as PrismaService);

  let userId: number | undefined;
  let postId: number | undefined;
  let userIds: number[] = [];

  beforeEach(async () => {
    const uniqueValue = `${Date.now()}-${Math.random()}`;
    const user = await prisma.user.create({
      data: {
        username: `like-test-${uniqueValue}`,
        email: `like-test-${uniqueValue}@example.com`,
        password: 'not-a-real-password',
      },
    });

    const post = await prisma.post.create({
      data: {
        title: `Like integration test ${uniqueValue}`,
        content: 'Temporary test data',
        authorId: user.id,
      },
    });

    userId = user.id;
    userIds = [user.id];
    postId = post.id;
  });

  afterEach(async () => {
    if (postId) {
      await prisma.post_Like.deleteMany({ where: { postId } });
      await prisma.post.delete({ where: { id: postId } });
    }

    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('keeps a consistent like state for concurrent requests', async () => {
    await Promise.all(
      Array.from({ length: 10 }, () =>
        likeService.updatePostLike({
          userId: userId!,
          targetId: postId!,
          type: Like_Type.like,
        }),
      ),
    );

    const [post, postLikes] = await Promise.all([
      prisma.post.findUniqueOrThrow({ where: { id: postId! } }),
      prisma.post_Like.findMany({
        where: { userId: userId!, postId: postId! },
      }),
    ]);

    expect(postLikes.length).toBeLessThanOrEqual(1);
    expect(post.likes).toBe(postLikes.length);
  });

  it('keeps the like count correct when different users like concurrently', async () => {
    const uniqueValue = `${Date.now()}-${Math.random()}`;
    const users = await Promise.all(
      Array.from({ length: 10 }, (_, index) =>
        prisma.user.create({
          data: {
            username: `like-concurrency-${uniqueValue}-${index}`,
            email: `like-concurrency-${uniqueValue}-${index}@example.com`,
            password: 'not-a-real-password',
          },
        }),
      ),
    );
    userIds.push(...users.map((user) => user.id));

    await Promise.all(
      users.map((user) =>
        likeService.updatePostLike({
          userId: user.id,
          targetId: postId!,
          type: Like_Type.like,
        }),
      ),
    );

    const [post, postLikes] = await Promise.all([
      prisma.post.findUniqueOrThrow({ where: { id: postId! } }),
      prisma.post_Like.findMany({ where: { postId: postId! } }),
    ]);

    expect(postLikes).toHaveLength(users.length);
    expect(post.likes).toBe(users.length);
  });
});
