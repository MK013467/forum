import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/User.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/passport/LocalAuthGuard';
import { PassThrough } from 'stream';
@Controller('user')
export class UsersController {
    constructor(private userService: UsersService){}
   
    @UseGuards(LocalAuthGuard)
    @Get()
    getUserProfile(){
        
    }


    @Delete('me')
    async deleteUserByUsername(@Req() req:any, @Res({passthrough:true}) res:any){
        const userId = req.user!.id;
        await this.userService.deleteUser(userId);

        // loging out
        await new Promise<void>((resolve, reject) => {
            req.logout((err: any) => (err? reject(err) : resolve()));
        });
        
        await new Promise<void>((resolve, reject) => {
            req.session.destroy((err: any) => { err ? reject(err) : resolve()});
        });
        
        // Clear sessions
        res.clearCookie('connect.sid');
        

        return { message: 'account deleted' };
    }

}


