import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentdto } from './dtos/CreateComment.dto';
import { ShowCommentDto } from './dtos/ShowComment.dto';
import { UpdateCommentDto } from './dtos/UpdateComment.dto';

@Injectable()
export class CommentService {

    constructor(private readonly prisma:PrismaService){}

    async findAllCommentsforPost(dto:ShowCommentDto){
        try{
            const comment = this.prisma.comment.findMany({});
            return comment;
        }

        catch(err){
            console.log(err.msg)
        }
    }

    async createComment(dto:CreateCommentdto){
        try{
            const comment = await this.prisma.comment.create({
                data:{
                    content:dto.content,
                    authorId:dto.authorId,
                    postId:dto.postId

                }
            })

            return comment;
        }
        catch(err){

        }
    }
    
    async updateComment(commentId: number, loggedInUserId:number, dto:UpdateCommentDto){
        try{
            const comment = await this.prisma.comment.findUnique({
                where:{
                    id:commentId
                }
            })

            if (!comment) {
                throw new NotFoundException('Comment not found');
              }
            
            if (comment.authorId !== loggedInUserId) {
                throw new ForbiddenException('You cannot delete this comment');
            }

            await this.prisma.comment.update({
                where:{
                    id:commentId
                },
                data:{
                    content:dto.content
                }
            });

            return { message: 'Comment updated' };
        }

        catch(err){
            console.log(err);
        }
    }
    

    async deleteComment(commentId:number , loggedInUserId:number){
        try{
            const comment = await this.prisma.comment.findUnique({
                where:{
                    id:commentId
                }
            });

            if (!comment) {
                throw new NotFoundException('Comment not found');
              }
            
              if (comment.authorId !== loggedInUserId) {
                throw new ForbiddenException('You cannot delete this comment');
              }
            
            await this.prisma.comment.delete({
                where: { id: commentId }
            });

            return { message: 'Comment deleted' };
        
        }
        catch(err){

        }
    }

}
