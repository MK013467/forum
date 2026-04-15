import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports:[MailService],
  providers: [MailService],
})
export class MailModule {}
