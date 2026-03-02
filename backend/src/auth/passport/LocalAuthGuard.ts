import { Injectable, CanActivate , ExecutionContext} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){

  
    // returns a boolean indicating whether the current request is allowed or not
    //ExecutionContext inherits from ArgumentsHost.
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        //store session
        await super.logIn(request);		
        //result is type of boolean	
        return result;
      }
}