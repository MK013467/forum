import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private readonly resend = new Resend(process.env.RESEND_API_KEY);
    private readonly welcomeMailHtml = ( username) => {
        return `<h1>Welcome to Forum Service ${username}</h1> <br/> <a href="forum-app-production.up.railway.app">Visit Service </a>`
    }

    async sendWelcomeMail(userEmail:string , username:string){
        const {data } = await this.resend.emails.send({
            from:"minsuk603@gmail.com",
            to:userEmail,
            subject:"Welcome to Forum Service",
            html:this.welcomeMailHtml(username)
        })
    }
}
