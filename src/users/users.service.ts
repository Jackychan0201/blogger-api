import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = this.usersRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = this.usersRepository.save(user);

    const { password, ...result } = await savedUser;
    return result as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
       where: { email },
       select: ['id', 'email', 'password'],
      }
    );
  }
}
