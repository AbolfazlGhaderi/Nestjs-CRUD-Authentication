import { IsEmail } from 'class-validator';

export class OTPLoginDto {
  @IsEmail({}, { message: 'The Email Entered is Incorrect' })
  email: string;
  code?:string
}

