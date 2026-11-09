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
import { CreateCommentdto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/passport/AuthenticatedGuard';

@Controller('comment')
export class CommentController {
  constructor(private comemntService: CommentService) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createComment(@Body() dto: CreateCommentdto, @Req() req: Request) {
    // The guard already blocks logged-out users; this narrows req.user for TS.
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    return this.comemntService.createComment(req.user.id, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  async updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: Request,
    @Body() dto: UpdateCommentDto,
  ) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    return this.comemntService.updateComment(commentId, req.user.id, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
    if (!req.isAuthenticated()) throw new UnauthorizedException();
    return this.comemntService.deleteComment(commentId, req.user.id);
  }
}
