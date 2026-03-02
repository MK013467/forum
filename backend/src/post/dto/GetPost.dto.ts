import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString } from "class-validator";

export class GetPostDto{

    @IsOptional()
    @IsString()
    searchField?: string;

    @IsOptional()
    @IsIn(['createdAt', 'likes' , 'views'])
    orderBy?: 'creatdAt' | 'likes' | 'views';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    orderDirection: 'asc' | 'desc';
}