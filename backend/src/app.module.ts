import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/AuthModule';
import { PostModule } from './post/post.module';
import { S3Module } from './s3/s3.module';
import { CommentModule } from './comment/comment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LikeModule } from './like/like.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app/app.controller';
import { MailModule } from './mail/mail.module';
import { RecommendationService } from './recommendation/recommendation.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      max: 100,
      // 1h
      ttl: 60 * 60 * 1000,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      // Per IP and per route. @Throttle({ default: ... }) overrides it per route.
      { name: 'default', ttl: 60_000, limit: 60 },
      // Login attempts per username, so rotating IPs can't brute-force one
      // account. Throttles instead of locking the account, so an attacker
      // can't lock someone out on purpose.
      {
        name: 'loginAccount',
        ttl: 15 * 60_000,
        limit: 10,
        getTracker: (req: { body?: { username?: unknown } }) => {
          const username = req.body?.username;
          return `login:${typeof username === 'string' ? username.toLowerCase() : ''}`;
        },
        skipIf: (ctx) =>
          !(
            ctx.getClass().name === 'AuthController' &&
            ctx.getHandler().name === 'login'
          ),
      },
    ]),
    PassportModule.register({ session: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    PostModule,
    S3Module,
    CommentModule,
    LikeModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    RecommendationService,
    // Without a registered guard, ThrottlerModule config and @Throttle do nothing.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
