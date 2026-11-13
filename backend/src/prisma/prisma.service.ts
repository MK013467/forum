import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('db is connected');
    } catch (err: unknown) {
      this.logger.error(
        'error connecting to db',
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }
}
