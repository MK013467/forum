import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Express.User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException(
        'User does not exist or invalid password',
      );
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
