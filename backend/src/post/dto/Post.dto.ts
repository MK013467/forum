import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Only fields the client may set. id, authorId, createdAt, views and likes
// are owned by the server.
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @IsString()
  @MaxLength(10000)
  content: string;
}
