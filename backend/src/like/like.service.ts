import { Injectable } from '@nestjs/common';
import { Like_Type } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type UpdateLikeInput ={
    targetId:number;
    type:Like_Type
    userId:number;
}

@Injectable()
export class LikeService {
    constructor(private readonly prisma:PrismaService){}

    async updatePostLike(input:UpdateLikeInput){
        const existingLike = await this.prisma.post_Like.findUnique({
            where:{
                postId_userId:
                 {userId:input.userId,
                postId:input.targetId}
            }
        })

        //Like does not exist
        if(input.type === 'like'){


            //If user havent liked the post, we simply created a new like in the like table
            // with type == 'like'
            // and update #of likes for the target post
            if(!existingLike){
                const result = await this.prisma.$transaction([
                    this.prisma.post_Like.create({
                        data:{
                            userId:input.userId,
                            postId:input.targetId,
                            type:input.type
                        }
                    }),
                    this.prisma.post.update({
                        where:{ id :input.targetId},
                        data:{
                            likes:{
                                increment:1
                            }
                        }              
                    })
                ])

                console.log(result);
                return result;
            }
        
            //If there is existing like there are basically two possibilities 
            //1. User had liked this post and pushed like button
            //2. User had disliked this post and pushed like button
            //For both of cases, our goal is to change our tables so that it is same has user haven't done anything to the post
            //To achive this we do the following,
            //For the first case we delete a row in the like table decrement and decrement # of likes for the target post "
            //For the second case we delete a row in the second post and increment # of likes for the target post"
            else{
                const likeChange = existingLike.type === 'like'? 'decrement':'increment'
                const result = await this.prisma.$transaction([
                    this.prisma.post_Like.delete({
                        where:{
                            postId_userId:{
                                postId:input.targetId,
                                userId:input.userId
                            }
                        }
                    }),
                    this.prisma.post.update({
                        where:{id: input.targetId},
                        data:{
                            likes:{
                                [likeChange]:1
                            }
                        }
                    })
                ]);

                console.log(result);
                return result;
            }    
        }

        //when input type === 'dislike'
        else{
            if(!existingLike){
                const result = await this.prisma.$transaction([
                    this.prisma.post_Like.create({
                        data:{
                            userId:input.userId,
                            postId:input.targetId,
                            type:input.type
                        }
                    }),
                    this.prisma.post.update({
                        where:{ id :input.targetId},
                        data:{
                            likes:{
                                decrement:1
                            }
                        }              
                    })
                ])

                console.log(result);
                return result;
            }

            //similar logic applies like above applies
            else{
                const likeChange = existingLike.type === 'like'? 'decrement':'increment'
                const result = await this.prisma.$transaction([
                    this.prisma.post_Like.delete({
                        where:{
                            postId_userId:{
                                postId:input.targetId,
                                userId:input.userId
                            }
                        }
                    }),
                    this.prisma.post.update({
                        where:{id: input.targetId},
                        data:{
                            likes:{
                                [likeChange]:1
                            }
                        }
                    })
                ]);

                console.log(result);
                return result;
            }
        }

    }

    async updateCommentLike(input: UpdateLikeInput){
        const existingLike = await this.prisma.comment_Like.findUnique({
            where:{
                userId_commentId:
                 {userId:input.userId,
                commentId:input.targetId}
            }
        })

        //Like does not exist
        if(input.type === 'like'){


            //If user havent liked the post, we simply created a new like in the like table
            // with type == 'like'
            // and update #of likes for the target post
            if(!existingLike){
                const result = await this.prisma.$transaction([
                    this.prisma.comment_Like.create({
                        data:{
                            userId:input.userId,
                            commentId:input.targetId,
                            type:input.type
                        }
                    }),
                    this.prisma.comment.update({
                        where:{ id :input.targetId},
                        data:{
                            likes:{
                                increment:1
                            }
                        }              
                    })
                ])

                console.log(result);
                return result;
            }
        
          
            else{
                const likeChange = existingLike.type === 'like'? 'decrement':'increment'
                const result = await this.prisma.$transaction([
                    this.prisma.comment_Like.delete({
                        where:{
                            userId_commentId:{
                                commentId:input.targetId,
                                userId:input.userId
                            }
                        }
                    }),
                    this.prisma.comment.update({
                        where:{id: input.targetId},
                        data:{
                            likes:{
                                [likeChange]:1
                            }
                        }
                    })
                ]);

                console.log(result);
                return result;
            }    
        }

        //when input type === 'dislike'
        else{
            if(!existingLike){
                const result = await this.prisma.$transaction([
                    this.prisma.comment_Like.create({
                        data:{
                            userId:input.userId,
                            commentId:input.targetId,
                            type:input.type
                        }
                    }),
                    this.prisma.comment.update({
                        where:{ id :input.targetId},
                        data:{
                            likes:{
                                decrement:1
                            }
                        }              
                    })
                ])

                console.log(result);
                return result;
            }

            //similar logic applies like above applies
            else{
                const likeChange = existingLike.type === 'like'? 'decrement':'increment'
                const result = await this.prisma.$transaction([
                    this.prisma.comment_Like.delete({
                        where:{
                            userId_commentId:{
                                commentId:input.targetId,
                                userId:input.userId
                            }
                        }
                    }),
                    this.prisma.comment.update({
                        where:{id: input.targetId},
                        data:{
                            likes:{
                                [likeChange]:1
                            }
                        }
                    })
                ]);

                console.log(result);
                return result;
            }
        }
    }
}
