import { Body, Controller, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ShowCommentDto } from './dtos/ShowComment.dto';
import { CreateCommentdto } from './dtos/CreateComment.dto';

@Controller('comment')
export class CommentController {

    constructor(private comemntService: CommentService){}

    @Post()
    async showAllComentsforPost(@Body() dto:ShowCommentDto){
        const comments = await this.comemntService.findAllCommentsforPost
        return comments;
    }

    @Post('create')
    async createPost(@Body() dto:CreateCommentdto){
        
    }
}


