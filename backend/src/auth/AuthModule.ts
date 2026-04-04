import {Module} from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/LocalStrategy';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './passport/session.serializer';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports:[UsersModule, 
        PassportModule.register({ session: true }),
        MailModule],
    controllers: [AuthController],
    providers:[AuthService, LocalStrategy, SessionSerializer],
    exports:[AuthService]
})

export class AuthModule{}
