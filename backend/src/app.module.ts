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
import { LikeModule } from './like/like.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app/app.controller';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    CacheModule.register({
      max:100, 
      // 1h
      ttl:60*60*1000,
      isGlobal:true
    }),
    ThrottlerModule.forRoot([
    {
      ttl: 60_000,
      limit: 60,
    },]),
    PassportModule.register({ session: true }),
    UsersModule, PrismaModule, AuthModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client', 'dist'),
  }), PostModule, S3Module, CommentModule,  AccountModule, LikeModule, MailModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
