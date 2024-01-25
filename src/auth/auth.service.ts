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
import * as emailJs from '@emailjs/nodejs';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(OTPCode)
    private readonly otpCodeRepository: Repository<OTPCode>,
  ) {}

  async register(registerData: TRegister) {
    //-------------------- User Search in the DB -------------------

    const user = await this.usersService.findUserByEmail(registerData.email);
    if (user) throw new HttpException('User already exists', 400);

    //-------------------- hash password ---------------------------

    registerData.password = await bcrypt.hash(registerData.password, 10);

    const SavedUser = await this.usersService.create(registerData);
    if (!SavedUser) throw new HttpException('Error Save User', 400);

    return {
      statusCode: 201,
      message: 'User created successfully',
    };
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
    const accessToken = await this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      statusCode: 200,
      AccessToken: accessToken,
    };
  }

  async Otplogin(otpLoginData: OTPLoginDto) {
    if (!otpLoginData.code) {
      // -------------- user search in the DB -----------------------------

      const user = await this.usersService.findUserByEmail(otpLoginData.email);
      if (!user) throw new HttpException('User Not Found', 404);

      // -------------- Remove previous code from DB -------------------------------

      await this.otpCodeRepository.delete({ email: otpLoginData.email });

      //--------------- Generate OTP Code  -------------------------

      const otpCode = (
        Math.floor(Math.random() * (99999 - 10000)) + 10000
      ).toString();

      // -------------- Create templateParams -----------------------------

      const templateParams = {
        user_email: otpLoginData.email,
        message: otpCode,
      };
      // -------------- Send Email ----------------------------------------

      return await emailJs
        .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, {
          publicKey: 'YOUR_PUBLIC_KEY',
          privateKey: 'YOUR_PRIVATE_KEY',
        })
        .then(async (response) => {
          console.log(
            `SUCCESS! Send to  : ${otpLoginData.email} / ${templateParams.message} `,
            response.status,
            response.text,
          );

          // -------------- Save OTP Code in the DB -------------------------

          const SavedCode = await this.otpCodeRepository.insert({
            email: otpLoginData.email,
            code: otpCode,
          });
          if (!SavedCode) throw new HttpException('Error Save Code', 400);

          return {
            message: 'Email sent successfully',
            email: otpLoginData.email,
          };
        })

        //----------- Handel Error Send Email ------------------------
        .catch((err) => {
          console.log(err);
          throw new HttpException('Error Send Email', 400);
        });
    } else {
      // -------------- code search in the DB -----------------------------

      const resultSearchOtpCode = await this.otpCodeRepository.findOne({
        where: {
          email: otpLoginData.email,
          code: otpLoginData.code,
        },
      });
      if (!resultSearchOtpCode) throw new HttpException('Wrong Code', 400);

      // -------------- Remove previous code from DB ----------------------

      await this.otpCodeRepository.delete({ email: otpLoginData.email });

      // -------------- Return User of the DB -----------------------------

      const user = await this.usersService.findUserByEmail(otpLoginData.email);

      //-------------------- Create AccessToken ---------------------------

      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        statusCode: 200,
        AccessToken: accessToken,
      };
    }
  }
}
