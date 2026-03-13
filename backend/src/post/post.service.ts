import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Postdto } from './dto/Post.dto';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { GetPostDto } from './dto/GetPost.dto';

@Injectable()
export class PostService {

    constructor(private prisma: PrismaService){}


    async getPost(id:number) {
        try{
            const post = this.prisma.post.update({
                include:{
                    author:{
                        select:{
                            username:true
                        }
                    } 
                }
                ,
                where:{
                    id:id
                },
                data:{
                    views:{
                        increment:1
                    }
                }
            });
            return post;
        }
        catch(err){
            throw new NotFoundException(`${id} of the post does not exist`)
        }
    }


    async getPosts(query:GetPostDto) {

        const {searchField, searchBy, orderByField} = query;
        const page = Number(query.page) || 1.
        const postsPerPage = 10;
        const posts = await this.prisma.post.findMany({
            take:postsPerPage,
            include:{
                author:{
                    select:{
                        username:true
                    }
                }
            },
            where:
             searchField? { [searchField] : { contains: searchBy }}:{}, 
            skip:(page-1)*postsPerPage,
            orderBy:[
                orderByField? {[orderByField]:'desc'} :{} ,
                {createsAt: 'desc'}
            ]
            
        })
        
         return posts.map(({ author, ...post }) => ({
            
            ...post,
            authorName: author.username,
          } ) );
    }
    


    



    async createPost(postdto : Postdto, id:number) {

        //createdAt is handled by prisma schema
        const posts = this.prisma.post.create({data:{

            title: postdto.title,
            content: postdto.content,
            authorId: id,
        }});
        return posts;
    }

    async updatePost(id: number, updatepostdto: UpdatePostDto, userId: any) {
        const post = await this.prisma.post.findUnique({
            where:{
                id:id
            },
        })
        if(!post) throw new Error("post not found");

        if(post.authorId !== userId){
            throw new ForbiddenException('You cannot edit this post');
        }

        return await this.prisma.post.update({
            where:{
                id: id
            },
            data:updatepostdto
        })



    }
    
    async handlePostlike(userId:number , postId:number){
    const post = await this.prisma.post.findUnique({
        where:{ id:postId}
        })
}
   
    getAllPost() {
        
    }
}
