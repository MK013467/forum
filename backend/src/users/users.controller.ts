import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/User.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UsersController {
    constructor(private userService: UsersService){}


    @Post('/signup')
    async createUser(@Body(new ValidationPipe()) createUserDto:CreateUserDto){
        
        const user = await this.userService.createUser(createUserDto)
        return user;
    }

   
    @Patch("")
    async updateUser(@Body( )  updateUserData:UserDto) {
        return ;
    }

    @Get()
    async getUsers(){
        const users = this.userService.getUser()
        return users;
    }

    @Get(":id")
    async getUserById(@Param('id', ParseIntPipe) id:number){
        const user =  this.userService.getUserById(id);
        return user;
    }

}


