import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/AuthModule';
import { PostModule } from './post/post.module';
import { S3Module } from './s3/s3.module';
import { CommentModule } from './comment/comment.module';
import { AccountModule } from './account/account.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [ ThrottlerModule.forRoot([
    {
      ttl: 60_000,
      limit: 60,
    },
  ]),UsersModule, PrismaModule, AuthModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client', 'dist'),
  }), PostModule, S3Module, CommentModule,  AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
