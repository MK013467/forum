import { IsString } from "class-validator";

export class ResetPasswordDto{
    @IsString()
    username: string;

    @IsString()
    token:string;

    @IsString()
    newPassword:string;
}