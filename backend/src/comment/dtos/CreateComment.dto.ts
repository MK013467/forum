import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateCommentdto{
    @IsNumber()
    @Type(() => Number)
    authorId:number;

    @IsNumber()
    @Type(() => Number)
    postId:number;
    @IsString()
    content:string;

}