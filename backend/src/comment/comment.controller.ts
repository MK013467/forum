import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentdto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';
import { Request } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private comemntService: CommentService) {}

  @Get()
  async showAllComentsforPost() {
    const comments = await this.comemntService.findAllCommentsforPost();
    return comments;
  }

  @Post('')
  async createComment(@Body() dto: CreateCommentdto) {
    console.log('running');
    const comment = await this.comemntService.createComment(dto);
    return comment;
  }

  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: Request,
    @Body() dto: UpdateCommentDto,
  ) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    const userId = req.user.id;
    const result = await this.comemntService.updateComment(
      commentId,
      userId,
      dto,
    );

    return result;
  }

  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    const userId = req.user.id;

    const result = await this.comemntService.deleteComment(commentId, userId);

    return result;
  }
}
