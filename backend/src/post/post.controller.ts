import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Postdto } from './dto/Post.dto';
import { AuthenticatedGuard } from 'src/auth/passport/AuthenticatedGuard';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { GetPostDto } from './dto/GetPost.dto';

@Controller('post')
export class PostController {
    constructor(private postService:PostService){}
  
    @Get(":id")
    async getPost(@Param('id', ParseIntPipe) id ){
        const post = await this.postService.getPost(id);
        return post;
    }

    @Get()
    async getPosts(@Query() query:GetPostDto){
        const post = await this.postService.getPosts(query);
        return post;
    }



    
    @UseGuards(AuthenticatedGuard)
    @Post("create")
    async createPost(@Body() postdto: Postdto ){
        const post = await this.postService.createPost(postdto);
        return post;

    }

    @UseGuards(AuthenticatedGuard)
    @Patch(":id")
    async updatePost( @Param('id') id,  @Body() updatepostdto:UpdatePostDto, @Req() req ){
        const post = await this.postService.updatePost(+id, updatepostdto, req.user.userId);{
            return post;
        }
    }
}
