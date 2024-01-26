import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OTPLoginDto } from './dto/otpLogin.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto:RegisterDto){
    return this.authService.register(registerDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto)
  }

  @Post('OTP-login')
  @HttpCode(HttpStatus.OK)
  otpLogin(@Body() otploginDto:OTPLoginDto){
    return this.authService.Otplogin(otploginDto)
  }



}
