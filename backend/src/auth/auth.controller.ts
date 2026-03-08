import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request , Response } from "express";
import { PassportModule } from "@nestjs/passport";
import { AuthenticatedGuard } from "./passport/AuthenticatedGuard";
import { LocalAuthGuard } from "./passport/LocalAuthGuard";
import { UsersService } from "src/users/users.service";

@Controller('auth')
export class AuthController{

    constructor(private usersService: UsersService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: any): Promise<{ message: string; user: any; }> {

        await new Promise((resolve, reject) => {
            req.login(req.user, (err) => {
            if (err) return reject(err);
            resolve(true);
            });
        });

        return {
            message: 'Login successful',
            user: req.user,
        };
    }
    

    @Post('logout')
    async logOut(@Req() req:Request , @Res() res:Response){
          //  Terminate Passport session
        req.logout((err: any) => {
                if (err) throw new Error('Logout failed');
            });


        // Clear the cookie
        res.clearCookie('connect.sid'); // 'connect.sid' is default
        res.status(200).json({ message: '로그아웃이 성공적으로 완료되었습니다.' });
    }


    @UseGuards(AuthenticatedGuard)
    @Get('profile')
    getprofile(@Req() req:any){
        return req.user
    }
}