import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'FirstName is Empty !' })
  @IsString({ message: 'ّFirstName must be a string ' })
  firstName: string;

  @IsNotEmpty({ message: 'LastName is Empty !' })
  @IsString({ message: 'LastName must be a string ' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is Empty !' })
  @IsString({ message: 'Email must be a string ' })
  @IsEmail({}, { message: 'The Email Entered is Incorrect' })
  email: string;

  @IsNotEmpty({ message: 'Password is Empty !' })
  @IsString({ message: 'Password must be a string ' })
  @MinLength(6,{ message: 'Password must be more than 6 digits' })
  password: string;

  @IsEnum(['Admin', 'User'], { message: 'The Role must be Admin or User' })
  role: string;
}

export type TUser = {
  firstName: string;

  lastName: string;

  email: string;

  password: string;
  role?: string;
};
