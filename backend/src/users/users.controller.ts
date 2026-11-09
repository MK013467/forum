import { Controller, Delete, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/auth/passport/LocalAuthGuard';
import { Request, Response } from 'express';
import { toError } from 'src/common/error';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Get()
  getUserProfile() {}

  @Delete('me')
  async deleteUserByUsername(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user!.id;
    await this.userService.deleteUser(userId);

    // loging out
    await new Promise<void>((resolve, reject) => {
      req.logout((err: unknown) => {
        if (err) reject(toError(err, 'Logout failed.'));
        else resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err: unknown) => {
        if (err) reject(toError(err, 'Failed to destroy the session.'));
        else resolve();
      });
    });

    // Clear sessions
    res.clearCookie('connect.sid');

    return { message: 'account deleted' };
  }
}
