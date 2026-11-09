import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateOTP } from './otp';

const RESEND_COOLDOWN_MS = 60_000;

@Injectable()
export class MailService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly welcomeMailHtml = (username: string) => {
    return `<h1>Welcome to Forum Service ${username}</h1> <br/> <a href="forum-app-production.up.railway.app">Visit Service </a>`;
  };
  private readonly verificationCodeHtml = (code: string) => {
    return `<h1>Verification Code</h1> 
        <br/>
        <strong>${code}</strong> 
        <br/>
        Enter this verification code to complete your sign-in. This expires in 5 minutes.`;
  };

  async sendWelcomeMail(userEmail: string, username: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'noreply@minsokforum.xyz',
      to: userEmail,
      subject: 'Welcome to Forum Service',
      html: this.welcomeMailHtml(username),
    });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      return data;
    }
  }

  async sendVerificationCode({
    userId,
    email,
  }: {
    userId: number;
    email: string;
  }) {
    const existing = await this.prisma.verificationCode.findUnique({
      where: { userId_type: { userId: userId, type: 'EMAIL_VERIFY' } },
    });

    // One email per account per minute. Return quietly instead of 429, so the
    // response looks the same as for an email with no account.
    const lastSentAt = existing?.updatesAt ?? existing?.createsAt;
    if (lastSentAt && Date.now() - lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
      return;
    }

    if (existing && existing.requestNum >= 5) {
      throw new HttpException(
        'You have requsted more than 5times',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = generateOTP(6);

    // use upsert becaus an user should not know the verification code is already sent or not
    await this.prisma.verificationCode.upsert({
      where: {
        userId_type: {
          userId: userId,
          type: 'EMAIL_VERIFY',
        },
      },

      create: {
        userId: userId,
        type: 'EMAIL_VERIFY',
        requestNum: 1,
        code: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },

      update: {
        code: otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        requestNum: { increment: 1 },
      },
    });

    const { error } = await this.resend.emails.send({
      from: 'noreply@minsokforum.xyz',
      to: email,
      subject: 'Verifcation Code from Forum Service',
      html: this.verificationCodeHtml(otp),
    });

    if (error)
      throw new InternalServerErrorException('Fail to Send verification Email');

    return { msg: 'success' };
  }
}
