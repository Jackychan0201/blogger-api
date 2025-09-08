import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create.dto';
import { UpdatePostDto } from './dto/update.dto';

@Injectable()
export class PostsService {
    constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    ) {}

    async createPost(dto: CreatePostDto, authorId: string): Promise<Post> {
        const post = this.postRepository.create({ ...dto, author: {id: authorId} });
        return this.postRepository.save(post);
    }

    async findAll(): Promise<Post[]> {
        return this.postRepository.find({ relations: ['author'], order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Post | null> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async updatePost(id: string, dto: UpdatePostDto, currentUserId: string): Promise<Post> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.author.id !== currentUserId) {
            throw new ForbiddenException('You are not the author of this post');
        }
        Object.assign(post, dto);
        return this.postRepository.save(post);
    }

    async deletePost(id: string, currentUserId: string): Promise<void> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['author'] });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (post.author.id !== currentUserId) {
            throw new ForbiddenException('You are not the author of this post');
        }
        await this.postRepository.remove(post);
    }
}
