import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/AuthModule';
import { PostModule } from './post/post.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client', 'dist'),
  }), PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
