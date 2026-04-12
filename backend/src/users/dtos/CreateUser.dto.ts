import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(1, {message:"username should be at least 1 characters"})
    @MaxLength(20, {message:"username should be less than 20 characters"})
    username: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(8, {message:"password should be at least 8 characters"})
    @MaxLength(20, {message:"password should be less than 20 characters"})
    password: string;
}