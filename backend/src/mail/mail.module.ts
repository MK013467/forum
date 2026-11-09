import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
