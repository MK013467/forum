import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Postdto } from './dto/Post.dto';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import { GetPostDto } from './dto/GetPost.dto';

@Injectable()
export class PostService {

    constructor(private prisma: PrismaService){}


    async getPostById(id:number) {
        try{
            const post = this.prisma.post.update({
                include:{
                    author:{
                        select:{
                            username:true
                        }
                    },
                    comments:{
                        include:{
                            author:{
                                select: {username:true}
                            }
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


    async getPosts(query: GetPostDto) {
        const { searchBy, searchField, orderByField } = query;
        const page = Number(query.page) || 1;
        const postsPerPage = 10;
      
        let where = {};
      
        if (searchField?.trim()) {
          if (searchBy === 'username') {
            where = {
              author: {
                username: {
                  contains: searchField,
                },
              },
            };
          } else if (searchBy === 'title') {
            where = {
              title: {
                contains: searchField,
              },
            };
          } else if (searchBy === 'content') {
            where = {
              content: {
                contains: searchField,
              },
            };
          }
        }
      
        const [total, posts] = await this.prisma.$transaction([
          this.prisma.post.count({ where }),
          this.prisma.post.findMany({
            where,
            take: postsPerPage,
            skip: (page - 1) * postsPerPage,
            include: {
              author: {
                select: {
                  username: true,
                },
              },
            },
            orderBy: [
              orderByField ? { [orderByField]: 'desc' } : { createsAt: 'desc' },
            ],
          }),
        ]);
      
        const postWithAuthor = posts.map(({ author, ...post }) => ({
          ...post,
          authorName: author.username,
        }));
      
        return {
          posts: postWithAuthor,
          totalPages: Math.ceil(total / postsPerPage),
          currentPage: page,
        };
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

    async deletePost(id:number , userId:number){
        const post = await this.prisma.post.findUnique({
            where:{
                id:id
            },
        })
        if(!post) throw new Error("post not found");
        if(post.authorId !== userId){
            throw new ForbiddenException('You cannot edit this post');
        }

        const result = await this.prisma.$transaction([
          this.prisma.comment.deleteMany({ where: { postId: id } }),
          this.prisma.post_Like.deleteMany({ where: { postId: id } }),
          this.prisma.post.delete({ where: { id } }),
        ]);

        return result;

    }
    
    async handlePostlike(userId:number , postId:number){
    const post = await this.prisma.post.findUnique({
        where:{ id:postId}
        })
}
   
    getAllPost() {
        
    }
}
