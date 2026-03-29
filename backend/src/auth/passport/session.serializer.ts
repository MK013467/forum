import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserDto } from "src/users/dtos/User.dto";
import { AuthService } from "../auth.service";
import { LoginUserdto } from "src/users/dtos/LoginUser.dto";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(private readonly authService: AuthService){
        super();
    }
    serializeUser(user: LoginUserdto, done: Function) {
        done(null, user.id );
    }
    
    async deserializeUser(
      userId: any,
      done: (err: Error | null, user: any) => void,
    ) {
      const user = await this.authService.findById(Number(userId));
  
      if (!user) {
        return done(new Error('User not found'), null);
      }
  
      done(null, {
        id:user.id,
        email: user.email,
        username: user.username
      });
    }

}