import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserDto } from "src/users/dtos/User.dto";
import { AuthService } from "../auth.service";
import { LoginUserdto } from "src/users/dtos/LoginUser.dto";

@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(private authService: AuthService){
        super();
    }
    serializeUser(user: LoginUserdto, done: Function) {
        done(null, user.id );
    }
    
    async deserializeUser(
      userId: number,
      done: (err: Error | null, user: any) => void,
    ) {
      const user = await this.authService.findById(userId);
  
      if (!user) {
        return done(new Error('User not found'), null);
      }
  
      const { password, ...safeUser } = user;
      done(null, safeUser);
    }

}