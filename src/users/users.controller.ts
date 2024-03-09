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
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/Guards/jwtauth.guard';
import { Request } from 'express';
import { roleGuard } from 'src/Guards/role.guard';
import { UpdateRoleDTO } from './dto/update.role.dto';
import { UpdateUserDTO } from './dto/update.user';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard, roleGuard)
  async getAllUser(@Req() request: Request) {
    const users = await this.usersService.findAllUsers(request.user['email']);

    if (!users[0]) throw new HttpException('The user does not exist', 404);

    return users;
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  async whoami(@Req() request: Request) {
    return await this.usersService.whoami(request.user['id']);
  }

  @Put('/updaterole/:id')
  @UseGuards(JwtAuthGuard, roleGuard)
  async updateRole(
    @Body() roleData: UpdateRoleDTO,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return await this.usersService.updateRole(roleData, id);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Body() userData: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return await this.usersService.updateUser(userData, id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, roleGuard)
  deleteUser(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
