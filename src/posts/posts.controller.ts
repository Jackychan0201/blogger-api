import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreatePostDto } from './dto/create.dto';
import { UpdatePostDto } from './dto/update.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createPost(@Body() dto: CreatePostDto, @Req() req) {  
    return this.postsService.createPost(dto, req.user.userId);
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
  async updatePost( @Body() dto: UpdatePostDto, @Param('id') id: string, @Req() req) {
    return this.postsService.updatePost(id, dto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deletePost(@Param('id') id: string, @Req() req) {
    return this.postsService.deletePost(id, req.user.userId);
  }

}
