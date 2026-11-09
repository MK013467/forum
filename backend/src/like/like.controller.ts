import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { UpdateLikeDto } from './dto/UpdateLike.dto';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { LIKE_THROTTLE } from 'src/common/throttle';

@Throttle(LIKE_THROTTLE)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post')
  async updatePostLike(@Req() req: Request, @Body() dto: UpdateLikeDto) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();

    return await this.likeService.updatePostLike({
      targetId: dto.targetId,
      type: dto.type,
      userId: req.user.id,
    });
  }

  @Post('comment')
  async updateCommentLike(@Req() req: Request, @Body() dto: UpdateLikeDto) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();

    return await this.likeService.updateCommentLike({
      targetId: dto.targetId,
      type: dto.type,
      userId: req.user.id,
    });
  }
}
