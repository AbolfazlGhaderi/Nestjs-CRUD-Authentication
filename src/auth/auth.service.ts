import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { TRegister } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OTPCode } from './entities/OTPcode.entity';
import { Repository } from 'typeorm';
import { OTPLoginDto } from './dto/otpLogin.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(OTPCode)
     private readonly otpCode:Repository<OTPCode>
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
    );

    return {
      statusCode: 200,
      AccessToken: accessToken,
    };
  }

  async Otplogin(otpLoginData : OTPLoginDto){
    if(!otpLoginData.code){

      return otpLoginData.email
    }
    else return otpLoginData.code

  }
}
