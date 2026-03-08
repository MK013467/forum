import { Body, Controller, Post } from '@nestjs/common';
import { SendCodeDto } from './dtos/SendCode.dto';
import { AccountService } from './account.service';
import { VerifyCodeDto } from './dtos/VerifyCode.dto';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService : AccountService){}

    @Post('send-code')
    async sendVerificationCode(@Body() {email}: SendCodeDto){
        return this.accountService.sendVerificationCode(email);
    }

    @Post('verify-code')
    async verifyCode(@Body() {email, code}: VerifyCodeDto){
        return this.accountService.verifyCode(email, code)
    }

    @Post('reset-password')
    async resetPassword(@Body() body:ResetPasswordDto){

        return this.accountService.resetPassword()
    }
}
