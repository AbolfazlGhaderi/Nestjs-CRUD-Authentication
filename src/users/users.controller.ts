import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/Guards/jwtauth.guard';
import { Request } from 'express';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/add-user')
  @UseGuards(JwtAuthGuard)
  create(@Body() userDto: UserDto, @Req() request: Request) {
    console.log(request.user);
    return this.usersService.create(userDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllUser(@Req() request: Request) {

    if (request.user['role']  !== 'Admin'){
      return {
        message: 'Unauthorized',
        statusCode: 401,
      };
    }

    const users = await this.usersService.findAllUsers();

    if (!users[0]) throw new HttpException("The user does not exist",404)


    return users
  }
}
