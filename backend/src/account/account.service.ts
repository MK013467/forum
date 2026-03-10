import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import * as crypto from 'crypto';


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

            //check whether the code is already sent
            const existingVerificationCode = await this.prisma.verificationCode.findUnique({
                where:{
                    userId:user.id
                }
            });

            //if yes then we first check the expires time and requestNum of the code

            if(existingVerificationCode){
                if( existingVerificationCode.requestNum >=5) {
                    throw new UnauthorizedException('Too many request');
                }

                else{
                    const updatedCode = await this.prisma.verificationCode.update({
                        where:{
                            id:existingVerificationCode.id
                        },
                        data:{
                            requestNum: {
                                increment:1
                            },
                            code:hashedCode,
                            updatesAt: new Date(Date.now()),
                            expiresAt: new Date(Date.now() + 60*5*1000)
                        }
                    })

                    await transporter.sendMail(mailOptions);
                    return code;
                }

                
            }

            else{
                await this.prisma.verificationCode.create({
                    data: {
                        userId: user.id,
                        type: "PASSWORD_RESET",
                        code: hashedCode,
                        expiresAt: new Date(Date.now() + 60 * 5 * 1000),
                    }
                });
        
                console.log("saved to db");
            }

            await transporter.sendMail(mailOptions);
            return code;

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    //verifices hashed code and returns resetpasswordtoken
    async verifyCode( email:string , code:string){
        try{

        const user = await this.userService.findUser('email',email);
        if(!user ) throw new UnauthorizedException('user does not exist');

        const codeFound = await this.prisma.verificationCode.findFirst({
            where:{
                userId:user.id,
                expiresAt:{
                    gt: new Date(Date.now())
                }
            },
        })


        //generate token
        const generateToken = () => {
            const token = crypto.randomBytes(12).toString('hex');
            return token;
        }

        const salt = await bcrypt.genSalt(12);
        const token = generateToken();
        const hashedToken = bcrypt.hashSync(token, salt);

        if(!codeFound || codeFound.expiresAt.getTime() < Date.now() ) throw new BadRequestException('Code Expired');        
        const isMatch = await bcrypt.compare( code , codeFound.code);

        if(!isMatch) throw new BadRequestException('Invalid Code');

        //store hashed token in db
        const existingVerificationCode =  await this.prisma.verificationCode.update({
            where:{
                userId:user.id
            },
            data:{
                token: hashedToken,
        //when code is verified we should set requestNum to 0 so that the user can resetPassword again in the future.
                requestNum:0
            }
        })
            return token;
        }

        
        catch(err){
            console.log(err)
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        
        try{
            const codeObject = await this.prisma.verificationCode.findUnique({
                where:
                    {
                        userId:resetPasswordDto.userId
                    }
            })
            if(!codeObject || !codeObject.token) throw new UnauthorizedException("");

            const isAuthorized = await bcrypt.compare(resetPasswordDto.token, codeObject.token);

            if(!isAuthorized) throw new UnauthorizedException("");

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(resetPasswordDto.password, salt);

            const updatedUser = await this.userService.updateUser({
                where:{id:resetPasswordDto.userId},
                data:{password:hashedPassword}
            });
        } 

        catch(err){
            console.log(err);
        }


    }


}
