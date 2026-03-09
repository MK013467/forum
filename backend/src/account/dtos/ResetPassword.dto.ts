import { Transform } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class ResetPasswordDto{
    @Transform(({ value }) => Number(value))
    @IsNumber()
    userId:number
    @IsString()
    token:string
    @IsString()
    password:string
}