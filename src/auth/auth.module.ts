import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OTPCode } from './entities/OTPcode.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:process.env.JWT_SECRET,
        signOptions: { expiresIn: '2d' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity,OTPCode]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService,JwtStrategy],
})
export class AuthModule {}
