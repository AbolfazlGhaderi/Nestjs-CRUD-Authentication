import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto{

    @IsNotEmpty({ message: 'Email is Empty !' })
    @IsString({ message: 'Email must be a string ' })
    @IsEmail({}, { message: 'The Email Entered is Incorrect' })
    email: string;
  
    @IsNotEmpty({ message: 'Password is Empty !' })
    @IsString({ message: 'Password must be a string ' })
    password: string;
}