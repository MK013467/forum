import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { MailService } from 'src/mail/mail.service';

// Same message for unknown user and wrong password, so login can't be used
// to check which usernames exist.
const INVALID_CREDENTIALS = 'Invalid username or password';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsernameWithPassword(username);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
    return user;
  }

  async signup(dto: CreateUserDto) {
    const findUser = await this.userService.findUserByUsername(dto.username);
    if (findUser) throw new ConflictException('username is already taken');
    const findEmail = await this.userService.findUserByEmail(dto.email);
    if (findEmail) throw new ConflictException('email is already registered');

    // createUser in DB
    await this.userService.createUser(dto);
    // send Welcome Email
    await this.mailService.sendWelcomeMail(dto.email, dto.username);

    return { msg: 'success' };
  }

  async findById(id: number) {
    return await this.userService.findUserById(id);
  }

  async sendEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return;
    }
    const result = await this.mailService.sendVerificationCode({
      userId: user.id,
      email: user.email,
    });
    return result;
  }
}
