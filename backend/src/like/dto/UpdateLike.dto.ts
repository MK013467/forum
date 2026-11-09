import { Transform } from 'class-transformer';
import { Like_Type } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class UpdateLikeDto {
  // @IsInt is required: with whitelist on, a field without a validator is stripped.
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt()
  targetId: number;

  @IsEnum(Like_Type)
  type: Like_Type;
}
