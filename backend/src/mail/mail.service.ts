import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from 'src/prisma/prisma.service';

function generateOTP(length = 6){
    let otp = "";
    for(let i = 0 ; i < length; i++){
        otp+= Math.floor(Math.random() * 10);
    }
    return otp;
}


@Injectable()
export class MailService {


    private readonly resend = new Resend(process.env.RESEND_API_KEY);
    private readonly welcomeMailHtml = ( username) => {
        return `<h1>Welcome to Forum Service ${username}</h1> <br/> <a href="forum-app-production.up.railway.app">Visit Service </a>`
    }
    private readonly verificationCodeHtml = (code) => {
        return `<h1>Verification Code</h1> 
        <br/>
        <h2>${code}</h2> 
        <br/>
        Enter this verification code to complete your sign-in. This expires in 10 minutes.`
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


    async sendVerificationCode({id, email}:{id:number, email:string}) {
        const otp = generateOTP(6);
        const {data, error } = await this.resend.emails.send({
            from:"noreply@minsokforum.xyz",
            to:email,
            subject:"Verifcation Code from Forum Service",
            html:""
        })

        return otp;
    }
}
