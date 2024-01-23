import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as Passport from 'passport'
import * as Session from 'express-session' 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:"*"})
  app.useGlobalPipes(new ValidationPipe())
  app.use(Session({
    secret: "Abolfazl",
  }))
  app.use(Passport.initialize())
  app.use(Passport.session())
  
  await app.listen(4000);
}
bootstrap();
