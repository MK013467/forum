import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {  ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import helmet from 'helmet';
import { createClient } from "redis";
import { RedisStore } from 'connect-redis';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function setUpSession(app: NestExpressApplication){
  const configService = app.get<ConfigService>(ConfigService);
  const redisClient = createClient({
    url:configService.get("REDIS_URL")
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
  
  await redisClient.connect();
    let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
    ttl:60*60
  })
  
  app.use(
    session({
      secret: configService.get("SECRET")||"SECRET",
      resave:false,
      store: redisStore,
      saveUninitialized: false,
      proxy:true,
      cookie: {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 60*60*1000 }
    })
  );

    app.use(passport.initialize());
    app.use(passport.session());
}


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await setUpSession(app);
  app.set('trust proxy', true);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
 
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
