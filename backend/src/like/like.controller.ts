import { Body, Controller, Get, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { UpdatePostDto } from 'src/post/dto/UpdatePost.dto';
import { LikeService } from './like.service';
import { UpdateCommentDto } from 'src/comment/dtos/UpdateComment.dto';
import { UpdateLikeDto } from './dto/UpdateLike.dto';

@Controller('like')
export class LikeController {

    constructor(private readonly likeService:LikeService){}

    @Post('post')
    async updatePostLike( @Req() req, @Body() dto:UpdateLikeDto ){
        const user= req.user;
        if(!user ) throw new UnauthorizedException();

        return await this.likeService.updatePostLike({
            targetId:dto.targetId,
            type:dto.type,
            userId:user.id,
        })
    }

   
    @Post('comment')
    async updateCommentLike( @Req() req, @Body() dto:UpdateLikeDto ){
        const user= req.user;
        if(!user ) throw new UnauthorizedException();

        return await this.likeService.updateCommentLike({
            targetId:dto.targetId,
            type:dto.type,
            userId: user.id,
        })
    }
}
