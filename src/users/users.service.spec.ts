import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UserRepository', useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with hashed password', async () => {
    const dto = { email: 'test@example.com', password: 'plainpass' };
    const hashedPassword = 'hashedpass';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const userEntity = { email: dto.email, password: hashedPassword };
    mockRepo.create.mockReturnValue(userEntity);
    mockRepo.save.mockResolvedValue({ id: '1', ...userEntity });

    const result = await service.createUser(dto);
    const userEntityWithoutPassword = { id: '1', email: dto.email };
    expect(result).toEqual( {...userEntityWithoutPassword} );
    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(mockRepo.create).toHaveBeenCalledWith({ email: dto.email, password: hashedPassword });
    expect(mockRepo.save).toHaveBeenCalledWith(userEntity);
  });

  it('should find user by email', async () => {
    const user = { id: '1', email: 'test@example.com', password: 'hashedpass' };
    mockRepo.findOne.mockResolvedValue(user);

    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(user);
    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: ['id', 'email', 'password'],
    });
  });

  it('should return null if user not found by email', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await service.findByEmail('notfound@example.com');
    expect(result).toBeNull();
  });
});
