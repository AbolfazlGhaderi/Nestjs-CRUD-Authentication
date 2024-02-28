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
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  async findAllUsers(email: string) {
    const Admin = await this.findUserByEmail(email);

    if (!Admin) throw new HttpException('user not find', 404);

    return await this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'date_create',
        'date_update',
        'role',
      ],
    });
  }

  async whoami(id: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      where: { id: id.toString() },
    });
    if(!user) throw new HttpException('user not find', 404);
    return user
  }

  async deleteUser(id:string){
    const deleted = await this.userRepository.delete(id)
    if(deleted.affected===0) throw new HttpException('user not found', 404);
    return {
      statuseCode : 200,
      message : 'user deleted successfully'
    }
  }
}
