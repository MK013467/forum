import { Transform, Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from "class-validator";


export class GetPostDto{

    @IsOptional()
    @IsString()
    searchBy?:string;

    @IsOptional()
    @IsIn(['content', 'title'])
    searchField?: 'content'|'title';

    @IsOptional()
    @IsIn(['createdAt', 'likes' , 'views'])
    orderByField?: 'creatdAt' | 'likes' | 'views';

    @IsOptional()
    @Transform(({value}) => Number(value))
    page: number;
}