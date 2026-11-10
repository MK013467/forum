import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
describe('AuthService', () => {
  let authService: AuthService;

  const mockUserService = {
    findUserByUsername: jest.fn(),
    findUserByEmail: jest.fn(),
    getUserByUsernameWithPassword: jest.fn(),
    createUser: jest.fn(),
  };
  const mockMailService = {
    sendWelcomeMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('sign up test', () => {
    it('sign up success', async () => {
      mockUserService.findUserByUsername.mockResolvedValue(null);
      mockUserService.findUserByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({ id: 1 });
      mockMailService.sendWelcomeMail.mockResolvedValue(true);
      await expect(
        authService.signup({
          username: 'user1',
          email: 'user1@gmail.com',
          password: 'abcd!234',
        }),
      ).resolves.toBeUndefined();
      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    });

    it('sign up throws error for existing username', async () => {
      mockUserService.findUserByUsername.mockResolvedValue({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'abcd!234',
      });
      await expect(
        authService.signup({
          username: 'user1',
          email: 'user1@gmail.com',
          password: 'abcd!234',
        }),
      ).rejects.toThrow();
    });

    it('sign up throws ConflictException for an existing email', async () => {
      mockUserService.findUserByUsername.mockResolvedValue(null);
      mockUserService.findUserByEmail.mockResolvedValue({ id: 2 });

      await expect(
        authService.signup({
          username: 'user2',
          email: 'user1@gmail.com',
          password: 'abcd!234',
        }),
      ).rejects.toThrow(new ConflictException('email is already registered'));
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const message = 'Invalid username or password';

    it('gives the same error for an unknown username', async () => {
      mockUserService.getUserByUsernameWithPassword.mockResolvedValue(null);

      await expect(authService.validateUser('nobody', 'pw')).rejects.toThrow(
        new UnauthorizedException(message),
      );
    });

    it('gives the same error for a wrong password', async () => {
      mockUserService.getUserByUsernameWithPassword.mockResolvedValue({
        id: 1,
        username: 'user1',
        password: await bcrypt.hash('right', 4),
      });

      await expect(authService.validateUser('user1', 'wrong')).rejects.toThrow(
        new UnauthorizedException(message),
      );
    });
  });
});
