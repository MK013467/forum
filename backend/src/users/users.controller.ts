import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/User.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UsersController {
    constructor(private userService: UsersService){}
   
    @Patch("")
    async updateUser(@Body( )  updateUserData:UserDto) {
        return ;
    }

    @Get()
    async getUsers(){
        const users = this.userService.getAllUsers()
        return users;
    }

    @Get(":id")
    async getUserById(@Param('id', ParseIntPipe) id:number){
        const user =  this.userService.findUserById(id);
        return user;
    }

    @Delete()
    async deleteUserByUsername(@Body() dto:DeleteUserDto){
        const user = this.userService.deleteUser(dto.username);
        return user;
    }

}


