import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login and return access token for valid credentials', async () => {
    const user = { id: '1', email: 'test@example.com', password: 'hashedpass' };
    mockUsersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('jwt-token');

    const result = await service.login('test@example.com', 'plainpass');
    expect(result).toEqual({ access_token: 'jwt-token' });
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('plainpass', 'hashedpass');
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email });
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    await expect(service.login('notfound@example.com', 'plainpass')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const user = { id: '1', email: 'test@example.com', password: 'hashedpass' };
    mockUsersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('test@example.com', 'wrongpass')).rejects.toThrow(UnauthorizedException);
  });
});
