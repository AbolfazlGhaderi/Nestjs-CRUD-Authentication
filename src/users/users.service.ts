import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TUser, UserDto } from './dto/user.dto';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateRoleDTO } from './dto/update.role.dto';
import { UpdateUserDTO } from './dto/update.user';

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

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new HttpException('user not find', 404);
    return user;
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
    if (!user) throw new HttpException('user not find', 404);
    return user;
  }

  async updateRole(roleData: UpdateRoleDTO, id: string) {
    const user = await this.findUserById(id);

    user.role = roleData.role;
    await this.userRepository.save(user);
    return 'user updated successfully';
  }

  async updateUser(userData: UpdateUserDTO, id: string) {
    const user = await this.findUserById(id);
    if (user.email === userData.email)
      throw new HttpException('this email is exist', 400);

    for (const key in userData) {
      user[key] = userData[key];
    }

    await this.userRepository.save(user)
    return 'user updated successfully';
  }
  async deleteUser(id: string) {
    const deleted = await this.userRepository.delete(id);
    if (deleted.affected === 0) throw new HttpException('user not found', 404);
    return {
      statuseCode: 200,
      message: 'user deleted successfully',
    };
  }
}
