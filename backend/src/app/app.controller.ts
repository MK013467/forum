import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

// Health check: Railway must never get a 429 here.
@SkipThrottle()
@Controller('')
export class AppController {
  @Get()
  getHello() {
    return 'Hello';
  }
}
