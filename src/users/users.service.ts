import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TUser, UserDto } from './dto/user.dto';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: TUser) {
    const newUser= this.userRepository.create(userData)
    return await this.userRepository.save(newUser)
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }
  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
