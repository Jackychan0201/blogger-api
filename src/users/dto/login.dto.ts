import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'user@mail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongpassword123' })
  password: string;
}
