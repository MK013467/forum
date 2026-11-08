import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { LoginUserdto } from 'src/users/dtos/LoginUser.dto';

type SerializeDone = (error: Error | null, userId?: number) => void;
type DeserializeDone = (
  error: Error | null,
  user: Express.User | false | null,
) => void;

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(user: LoginUserdto, done: SerializeDone): void {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: DeserializeDone): Promise<void> {
    try {
      const user = await this.authService.findById(Number(userId));

      if (!user) {
        return done(null, false);
      }

      done(null, {
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (error: unknown) {
      done(
        error instanceof Error
          ? error
          : new Error('Failed to deserialize the session user.'),
        null,
      );
    }
  }
}
