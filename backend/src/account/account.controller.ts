import { Body, Controller, Post } from '@nestjs/common';
import { SendCodeDto } from './dtos/SendCode.dto';
import { AccountService } from './account.service';
import { VerifyCodeDto } from './dtos/VerifyCode.dto';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService : AccountService){}

    @Post('send-code')
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async sendVerificationCode(@Body() {email}: SendCodeDto){
        return this.accountService.sendVerificationCode(email);
    }

    @Post('verify-code')
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async verifyCode(@Body() {email, code}: VerifyCodeDto){
        return this.accountService.verifyCode(email, code)
    }

    @Post('reset-password')
    @Throttle({ default: { limit: 1, ttl: 60_000 } })
    async resetPassword(@Body() resetPassword:ResetPasswordDto){

        return this.accountService.resetPassword(resetPassword);
    }
}
