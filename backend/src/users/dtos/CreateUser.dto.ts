import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(1, {message:"username should be at least 1 characters"})
    username: string;
    displayName?: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(8, {message:"password should be at least 8 characters"})
    password: string;
}