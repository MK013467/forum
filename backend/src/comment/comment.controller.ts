import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/passport/AuthenticatedGuard';
import { Throttle } from '@nestjs/throttler';
import { COMMENT_WRITE_THROTTLE } from 'src/common/throttle';

@Throttle(COMMENT_WRITE_THROTTLE)
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    // The guard already blocks logged-out users; this narrows req.user for TS.
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    return this.commentService.createComment(req.user.id, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: Request,
    @Body() dto: UpdateCommentDto,
  ) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    return this.commentService.updateComment(commentId, req.user.id, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    return this.commentService.deleteComment(commentId, req.user.id);
  }
}
