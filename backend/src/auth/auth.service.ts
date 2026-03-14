import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/User.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor (private userService:UsersService){}

    async validateUser(username: string, password: string) {
        const user = await this.userService.getUserByUsername(username);
        if(!user) {
            console.log("User does not exists");
            throw new UnauthorizedException();
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            console.log("Password error");
            throw new UnauthorizedException()

        } 

        return user;
    }

    async findById(id:number){
        const user = await this.userService.findUserById(id);
        
        return user;
    }

    
    
}
