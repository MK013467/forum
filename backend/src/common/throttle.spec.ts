import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/auth/auth.controller';
import { CommentController } from 'src/comment/comment.controller';
import { LikeController } from 'src/like/like.controller';
import { PostController } from 'src/post/post.controller';

// Reads what @Throttle stored for the `default` throttler on a class or method.
const limitOf = (target: object) => ({
  limit: Reflect.getMetadata('THROTTLER:LIMITdefault', target) as number,
  ttl: Reflect.getMetadata('THROTTLER:TTLdefault', target) as number,
});

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

describe('throttling', () => {
  it('registers ThrottlerGuard as a global guard', () => {
    const providers = Reflect.getMetadata('providers', AppModule) as unknown[];

    expect(providers).toContainEqual({
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    });
  });

  // [name, controller, method (or null for a class-level limit), limit, ttl]
  it.each([
    ['login', AuthController, 'login', 5, MINUTE],
    ['signup', AuthController, 'createUser', 10, 15 * MINUTE],
    ['send-email', AuthController, 'sendEmail', 5, HOUR],
    ['create post', PostController, 'createPost', 5, MINUTE],
    ['update post', PostController, 'updatePost', 5, MINUTE],
    ['comments', CommentController, null, 10, MINUTE],
    ['likes', LikeController, null, 30, MINUTE],
  ] as const)('limits %s', (_name, controller, method, limit, ttl) => {
    const target = method
      ? (controller.prototype as unknown as Record<string, object>)[method]
      : controller;

    expect(limitOf(target)).toEqual({ limit, ttl });
  });
});
