import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('db is connected');
    } catch (err: unknown) {
      console.error('error connecting to db', err);
      throw err;
    }
  }
}
