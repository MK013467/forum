import { Body, Controller, Delete, ForbiddenException, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ShowCommentDto } from './dtos/ShowComment.dto';
import { CreateCommentdto } from './dtos/CreateComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';

@Controller('comment')
export class CommentController {

    constructor(private comemntService: CommentService){}

    @Post()
    async showAllComentsforPost(@Body() dto:ShowCommentDto){
        const comments = await this.comemntService.findAllCommentsforPost
        return comments;
    }

    @Post('')
    async createComment(@Body() dto:CreateCommentdto){
        const comment = await this.comemntService.createComment(dto);
        return comment;
    }

    @Patch('id')
    async updateComment(@Param('id', ParseIntPipe) commentId, @Req() req:any, @Body() dto:UpdateCommentDto ){
        const loggedInUser = req.user;
        if(!req.user) throw new ForbiddenException('User not authenticated');
        const userId = loggedInUser.id;
        const result = await this.comemntService.updateComment(commentId, userId, dto);

        return result;
    }

    @Delete(':id')
    async deleteComment(@Param('id', ParseIntPipe) commentId, @Req() req:any){
        const loggedInUser = req.user;
        if(!req.user) throw new ForbiddenException('User not authenticated');
        const userId = loggedInUser.id;

        const result = await this.comemntService.deleteComment(commentId, userId);

        return result;
    }
}


