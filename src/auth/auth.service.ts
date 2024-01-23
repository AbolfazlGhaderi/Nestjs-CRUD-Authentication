import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { TRegister } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerData: TRegister) {
    //-------------------- User Search in the DB -------------------
    const user = await this.usersService.findUserByEmail(registerData.email);
    if (user) throw new HttpException('User already exists', 400);

    //-------------------- hash password ---------------------------
    registerData.password = await bcrypt.hash(registerData.password, 10);
    return await this.usersService.create(registerData);
  }

  async login(loginData: LoginDto) {
    //-------------------- User Search in the DB -------------------

    const user = await this.usersService.findUserByEmail(loginData.email);
    if (!user) throw new HttpException('User Not Found', 404);

    //-------------------- Compare Password ------------------------

    const isPasswordMatch = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordMatch) throw new HttpException('Wrong Password', 400);

    //-------------------- Create AccessToken ---------------------
    const accessToken = await this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        secret:
          'JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.',
      },
    );

    return {
      statusCode: 200,
      AccessToken: accessToken,
    };
  }
}
