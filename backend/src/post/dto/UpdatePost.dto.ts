import { CreateUserDto } from "src/users/dtos/CreateUser.dto";
import { Postdto } from "./Post.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePostDto extends PartialType(Postdto){}
