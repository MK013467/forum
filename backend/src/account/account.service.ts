import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
    constructor(private  userService: UsersService, private  prisma:PrismaService){ }

    async sendVerificationCode(email) {
        const user = await this.userService.findUser('email', email);

        if(!user){
            console.log('User does not exist');
            return {};
        }

        const salt = await bcrypt.genSalt(12);


        //function to generate 6digits otp, from 000000 to 999999
        const genereateOTP =  ()=> {
            let  otp = String(Math.floor(100000 + Math.random() * 900000));
            otp = otp.padStart(6, '0');
            
            return otp;
        }


        //we stored hashed value of otp to user table
        const code = genereateOTP();
        const hashedCode = bcrypt.hashSync(code, salt);

        if(!user){
            console.log('User does not exist');
            return {};
        }       


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:"minsuk603@gmail.com",
                pass:"isyb bilf yzzm spfq"
            }
        })


        const mailOptions = {
            from: "minsuk603@gmail.com",
            to: email,
            subject: 'Verification Code from Forum Service',
            text:`Your verification Code: ${code}`
        }
        
        try {
            await transporter.sendMail(mailOptions);
            await this.prisma.verificationCode.create({
                data: {
                    userId: user.id,
                    type: "PASSWORD_RESET",
                    code: hashedCode,
                    expiresAt: new Date(Date.now() + 60 * 5 * 1000)
                }
            });
    
            console.log("saved to db");
    
            return { info: "Process is finished" };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //return a boolean whether or not sent code and code that user entered matches
    async verifyCode( email:string , code:string){

        const user = await this.userService.findUser('email',email);
        if(!user ) return false;

        const codeFound = await this.prisma.verificationCode.findFirst({
            where:{
                id:user.id,
                expiresAt:{
                    gt: new Date()
                }
            },
        })

        if(!codeFound) throw new BadRequestException('Code Expired');        
        const isMatch = await bcrypt.compare( code, codeFound.code );
        if(!isMatch) throw new BadRequestException('Invalid Code');
        
        return true;

    }
    async resetPassword() {
    }
}
