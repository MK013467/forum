import { Transform } from "class-transformer";
import { Like_Type } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateLikeDto{
    @Transform(({value})=> Number(value))
    targetId:number;
    @IsEnum(Like_Type)
    type:Like_Type;
}