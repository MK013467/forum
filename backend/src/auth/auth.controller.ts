import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request , Response } from "express";
import { AuthenticatedGuard } from "./passport/AuthenticatedGuard";
import { LocalAuthGuard } from "./passport/LocalAuthGuard";
import { UsersService } from "src/users/users.service";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

@Controller('auth')
export class AuthController{


    
    // 5 login attempts per minute
    @Throttle({ default: { ttl: 60000, limit: 5 } }) 
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
    
    @SkipThrottle()
    @Post('logout')
    async logOut(@Req() req:Request , @Res() res:Response){
          //Terminate Passport session
        req.logout((err: any) => {
                if (err) throw new Error('Logout failed');
            });


        // Clear the cookie
        res.clearCookie('connect.sid'); // 'connect.sid' is default
        res.status(200).json({ message: 'user logged out.' });
    }


    @UseGuards(AuthenticatedGuard)
    @Get('profile')
    getprofile(@Req() req:any){
        return {
            user: req.user ?? null,
            isAuthenticated: req.isAuthenticated?.() ?? false,
            sessionID: req.sessionID,
            session: req.session,
          };
        
    }
}