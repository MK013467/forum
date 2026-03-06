import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {

    //Get user info and send mail to user.email
    async sendVerificationCode(){
        const CLIENT_ID = process.env.GOOGLE_ID;


        if(!CLIENT_ID) { 
            throw new HttpException('Something unexpected happened on the server'
            , HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }


}
