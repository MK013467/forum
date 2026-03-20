import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Postdto } from './dto/Post.dto';
import { AuthenticatedGuard } from 'src/auth/passport/AuthenticatedGuard';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { GetPostDto } from './dto/GetPost.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
    constructor(private postService:PostService){}

    @Get()
    async getPosts(@Query() query:GetPostDto){
        const result = await this.postService.getPosts(query);
        return result;
    }

    @Get(':id')
    async getPostId(@Param('id', ParseIntPipe) id){
        const post = await this.postService.getPostById(id);
        return post;
    }

    
    @UseGuards(AuthenticatedGuard)
    @Post()
    async createPost(@Body() postdto: Postdto, @Req() req:any ){
        if(!req.user) throw new UnauthorizedException('');

        const id = req.user.id;

        const post = await this.postService.createPost(postdto, id);
        return post;
    }

    @UseGuards(AuthenticatedGuard)
    @Patch(":id")
    async updatePost( @Param('id' , ParseIntPipe) id,  @Body() updatepostdto:UpdatePostDto, @Req() req ){
        const post = await this.postService.updatePost(+id, updatepostdto, req.user.userId);{
            return post;
        }
    }

    @UseGuards(AuthenticatedGuard)
    @UseInterceptors(FileInterceptor('file '))
    @Post("/:id/upload-file")
    async uploadImageToPost ( @UploadedFile() file:Express.Multer.File , @Param('id', ParseIntPipe) id,  @Body() updatepostdto:UpdatePostDto, @Req() req): Promise<void>{

    }
}
