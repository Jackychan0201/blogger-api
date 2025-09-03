import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register.dto';
import { User } from './users.entity';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User successfully registered' })
  async register(@Body() dto: RegisterUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }
}
