import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CreatePostDto } from './dto/create.dto';
import { UpdatePostDto } from './dto/update.dto';
import type { Request } from 'express';
import { JwtUser } from '../auth/jwt-user.type';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createPost(@Body() dto: CreatePostDto, @Req() req: Request) {  
    const user = req.user as JwtUser;
    return this.postsService.createPost(dto, user.userId);
  }

  @Get()
  async getAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', description: 'Post ID (UUID)' })
  async getPostById(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updatePost(@Body() dto: UpdatePostDto, @Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.postsService.updatePost(id, dto, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePost(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.postsService.deletePost(id, user.userId);
  }

}
