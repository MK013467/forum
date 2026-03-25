import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';
import helmet from 'helmet';
import { createClient } from "redis";
import { RedisStore } from 'connect-redis';

export function setUpSession(app: INestApplication): void{
  const configService = app.get<ConfigService>(ConfigService);
  const redisClient = createClient();
  redisClient.connect().catch(console.error);

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
  const app = await NestFactory.create(AppModule);
  setUpSession(app);
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
