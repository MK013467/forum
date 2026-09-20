import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
