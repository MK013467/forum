import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports:[MailService],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
