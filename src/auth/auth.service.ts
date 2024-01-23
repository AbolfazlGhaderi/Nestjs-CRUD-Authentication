import { HttpException, Injectable } from '@nestjs/common';
import { TUser, UserDto } from 'src/users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerData: TUser) {
    
    //-------------------- User Search in the DB -------------------
    const user = await this.usersService.findUserByEmail(registerData.email);
    if (user) throw new HttpException('User already exists', 400);

    //-------------------- hash password -------------------
    registerData.password= await bcrypt.hash(registerData.password, 10);
     return await this.usersService.create(registerData);
  }

  login(loginData: LoginDto) {}
}
