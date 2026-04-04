import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private readonly resend = new Resend(process.env.RESEND_API_KEY);
    private readonly welcomeMailHtml = ( username) => {
        return `<h1>Welcome to Forum Service ${username}</h1> <br/> <a href="forum-app-production.up.railway.app">Visit Service </a>`
    }

    async sendWelcomeMail(userEmail:string , username:string){
        const {data , error} = await this.resend.emails.send({
            from:'noreply@minsokforum.xyz',
            to:userEmail,
            subject:"Welcome to Forum Service",
            html:this.welcomeMailHtml(username)
        })

        if(error ){
            console.log(error);
        }
        else{
            console.log(data);
            return data;
        }    
    }
}
