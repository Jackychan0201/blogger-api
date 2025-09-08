import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: 'PostRepository', useValue: mockRepo },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
      const dto = { title: 'New Post', content: 'This is the content of the new post.' };
      const authorId = 'author-1';
      const post = { ...dto, author: { id: authorId } };
      mockRepo.create.mockReturnValue(post);
      mockRepo.save.mockResolvedValue({ id: '1', ...post });

      const result = await service.createPost(dto, authorId);
      expect(result).toEqual({ id: '1', ...post });
      expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, author: { id: authorId } });
      expect(mockRepo.save).toHaveBeenCalledWith(post);
  });

  it('should return all posts', async () => {
    mockRepo.find.mockResolvedValue([{ id: '1', title: 'Test Post', author: { id: 'author-1' } }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: '1', title: 'Test Post', author: { id: 'author-1' } }]);
    expect(mockRepo.find).toHaveBeenCalledWith({ relations: ['author'], order: { createdAt: 'DESC' } });
  });

  it('should return a post by id', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1', title: 'Test Post', author: { id: 'author-1' } });
    const result = await service.findOne('1');
    expect(result).toEqual({ id: '1', title: 'Test Post', author: { id: 'author-1' } });
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['author'] });
  });

  it('should throw NotFoundException if post not found in findOne', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne('2')).rejects.toThrow('Post not found');
  });

  it('should update a post', async () => {
    const id = '1';
    const dto = { title: 'Updated Post' };
    const currentUserId = 'author-1';
    const post = { id, title: 'Old Title', author: { id: currentUserId } };
    mockRepo.findOne.mockResolvedValue(post);
    mockRepo.save.mockResolvedValue({ ...post, ...dto });

    const result = await service.updatePost(id, dto, currentUserId);
    expect(result).toEqual({ ...post, ...dto });
    expect(mockRepo.save).toHaveBeenCalledWith({ ...post, ...dto });
  });

  it('should throw NotFoundException if post not found in updatePost', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.updatePost('2', { title: 'x' }, 'author-1')).rejects.toThrow('Post not found');
  });

  it('should throw ForbiddenException if user is not author in updatePost', async () => {
    const post = { id: '1', title: 'Old Title', author: { id: 'author-2' } };
    mockRepo.findOne.mockResolvedValue(post);
    await expect(service.updatePost('1', { title: 'x' }, 'author-1')).rejects.toThrow('You are not the author of this post');
  });

  it('should delete a post', async () => {
    const id = '1';
    const currentUserId = 'author-1';
    const post = { id, title: 'Test', author: { id: currentUserId } };
    mockRepo.findOne.mockResolvedValue(post);
    mockRepo.remove.mockResolvedValue(undefined);

    await expect(service.deletePost(id, currentUserId)).resolves.toBeUndefined();
    expect(mockRepo.remove).toHaveBeenCalledWith(post);
  });

  it('should throw NotFoundException if post not found in deletePost', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.deletePost('2', 'author-1')).rejects.toThrow('Post not found');
  });

  it('should throw ForbiddenException if user is not author in deletePost', async () => {
    const post = { id: '1', title: 'Test', author: { id: 'author-2' } };
    mockRepo.findOne.mockResolvedValue(post);
    await expect(service.deletePost('1', 'author-1')).rejects.toThrow('You are not the author of this post');
  });
});
