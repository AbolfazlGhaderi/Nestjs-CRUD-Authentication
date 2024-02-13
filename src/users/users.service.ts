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

  async findAllUsers (){
    return await this.userRepository.find({select:['id','firstName','lastName','email','date_create','date_update','role']});
  }
}
