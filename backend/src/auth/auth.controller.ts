import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './passport/LocalAuthGuard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { SendEmailDto } from './dto/sendEmail.dto';
import { toError } from 'src/common/error';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  // 5 login attempts per minute
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new Error('Authenticated user is missing after login.');
    }

    await new Promise<void>((resolve, reject) => {
      req.login(user, (error: unknown) => {
        if (error) {
          reject(toError(error, 'Login failed.'));
          return;
        }

        resolve();
      });
    });

    return { message: 'Login successful', user };
  }

  @SkipThrottle()
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await new Promise<void>((resolve, reject) => {
      req.logout((error: unknown) => {
        if (error) {
          reject(toError(error, 'Logout failed.'));
          return;
        }

        resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error: unknown) => {
        if (error) {
          reject(toError(error, 'Failed to destroy the session.'));
          return;
        }

        resolve();
      });
    });

    res.clearCookie('connect.sid');
    return { message: 'user logged out.' };
  }

  // @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getprofile(@Req() req: Request) {
    return {
      user: req.user ?? null,
      isAuthenticated: req.isAuthenticated?.() ?? false,
      sessionID: req.sessionID,
      session: req.session,
    };
  }
  @Post('send-email')
  async sendEmail(@Body() { email }: SendEmailDto) {
    await this.authService.sendEmail(email);
  }
}
