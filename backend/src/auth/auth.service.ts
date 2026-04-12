import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
    constructor (private userService:UsersService, private mailService:MailService){}

    async validateUser(username: string, password: string) {
        const user = await this.userService.getUserByUsernameWithPassword(username);
        if(!user) {
            throw new UnauthorizedException("User does not exists");
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new UnauthorizedException("Password error")

        } 

        return user;
    }

    async findById(id:number){
        const user = await this.userService.findUserById(id);
        
        return user;
    }

    async signup(dto:CreateUserDto){
     
        const findUser = await this.userService.findUserByUsername(dto.username);
        if(findUser) throw new ConflictException('username is already taken');
            
        // createUser in DB
        await this.userService.createUser(dto);
        // send Welcome Email
        await this.mailService.sendWelcomeMail(dto.email,dto.username);
        
        return {msg:'success'};
       
    }

    async sendEmail(email:string){
        const user = await this.userService.findUserByEmail(email);
        if(!user){
            return ;
        }

        const code = await this.mailService.sendVerificationCode({id:user.id, email:user.email});
        
        return {msg:""};

    }



}
