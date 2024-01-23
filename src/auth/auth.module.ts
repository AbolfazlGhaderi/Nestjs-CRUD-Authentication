import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService,UsersService],
})
export class AuthModule {}
