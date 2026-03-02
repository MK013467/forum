import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(5, {message:"password should be at least 5 characters"})

    username: string;
    displayName?: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(8, {message:"password should be at least 8 characters"})
    password: string;
}