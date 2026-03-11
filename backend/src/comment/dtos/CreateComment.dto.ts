import { IsNumber, IsString } from "class-validator";

export class CreateCommentdto{
    @IsNumber()
    authorId:number;
    @IsNumber()
    postId:number;
    @IsString()
    content:string;

}