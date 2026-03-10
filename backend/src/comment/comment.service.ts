import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {

    constructor(private readonly prisma:PrismaService){}

    async findAllCommentsforPost(){
        try{
            const comment = this.prisma.comment.findMany({});
            return comment;
        }

        catch(err){
            console.log(err.msg)
        }
    }

}
