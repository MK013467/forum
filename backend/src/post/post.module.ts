import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/AuthModule';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[PrismaModule, AuthModule , UsersModule],
  providers: [PostService],
  controllers: [PostController],
  exports:[PostService]
})
export class PostModule {}
