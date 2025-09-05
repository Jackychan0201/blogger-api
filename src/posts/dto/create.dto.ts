import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({ example: "Post title" })
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @ApiProperty({ example: "Post contnet: sdoifjaifghadshdsghadkgfk" })
  content: string;
}
