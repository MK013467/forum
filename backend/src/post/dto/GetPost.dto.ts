import { Transform, Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class GetPostDto {
    @IsOptional()
    @IsIn(['title', 'content', 'username'])
    searchBy?: 'title' | 'content' | 'username';
  
    @IsOptional()
    @Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    })
    @IsString()
    searchField?: string;
  
    @IsOptional()
    @IsIn(['createdAt', 'likes', 'views'])
    orderByField?: 'createdAt' | 'likes' | 'views';
  
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page?: number;
  }