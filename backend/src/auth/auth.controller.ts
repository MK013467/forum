import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards, ValidationPipe } from "@nestjs/common";
import { Request , Response } from "express";
import { AuthenticatedGuard } from "./passport/AuthenticatedGuard";
import { LocalAuthGuard } from "./passport/LocalAuthGuard";
import { UsersService } from "src/users/users.service";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dtos/CreateUser.dto";

@Controller('auth')
export class AuthController{

    constructor(private readonly authService : AuthService){}
    
    @Post('/signup')
    async createUser(@Body(new ValidationPipe()) createUserDto:CreateUserDto){
        
        const user = await this.authService.createUser(createUserDto)
        return user;
    }

   
    // 5 login attempts per minute
    @Throttle({ default: { ttl: 60000, limit: 5 } }) 
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: any) {
        console.log('before login - user:', req.user);
        
        await new Promise((resolve, reject) => {
            req.login(req.user, (err) => {
                if (err) {
                    console.log('req.login ERROR:', err); // ← 에러 있는지
                    return reject(err);
                }
                console.log('after login - session:', req.session); // ← 세션 있는지
                console.log('after login - sessionID:', req.sessionID);
                resolve(true);
            });
        });

        return { message: 'Login successful', user: req.user };
    }






    @SkipThrottle()
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      await new Promise<void>((resolve, reject) => {
        req.logout((err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });
    
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });
    
      res.clearCookie('sid');
      return { message: 'user logged out.' };
    }


    // @UseGuards(AuthenticatedGuard)
    @Get('profile')
    getprofile(@Req() req:Request){
        return {
            user: req.user ?? null,
            isAuthenticated: req.isAuthenticated?.() ?? false,
            sessionID: req.sessionID,
            session: req.session,
          };
        
    }

    @Post("send-email")
    sendEmail(){
      
    }
}