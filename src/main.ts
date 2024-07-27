import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as Passport from 'passport'
import * as Session from 'express-session' 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:"*"})
  app.useGlobalPipes(new ValidationPipe())
  app.use(
    Session({
      secret:
        process.env.SESSION_SECRET,
    }),
  );
  app.use(Passport.initialize())
  app.use(Passport.session())
  const PORT = process.env.PORT || 4000;
  await app.listen(PORT,'0.0.0.0',()=>{
    console.log('App is Running on Port: ' + PORT);
  });
}
bootstrap();
