import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import helmet from 'helmet';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

const logger = new Logger('Bootstrap');

export async function setUpSession(app: NestExpressApplication) {
  const configService = app.get<ConfigService>(ConfigService);
  const redisClient = createClient({
    url: configService.get('REDIS_URL'),
  });

  redisClient.on('error', (err: Error) => {
    logger.error('Redis Client Error', err.stack);
  });

  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:',
    ttl: 60 * 60,
  });

  app.use(
    session({
      secret: configService.get('SECRET') || 'SECRET',
      resave: true,
      store: redisStore,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Trust only Railway's one proxy hop. `true` trusts every X-Forwarded-For
  // entry, so a client could send a fake IP and dodge rate limits.
  app.set('trust proxy', 1);
  await setUpSession(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [process.env.FRONTEND_URL!, 'http://localhost:5173'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Origin', 'Accept', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.use(helmet());
  // For success
  app.useGlobalInterceptors(new ResponseInterceptor());
  // // For errors
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err: unknown) => {
  logger.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
