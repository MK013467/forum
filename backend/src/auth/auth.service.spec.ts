import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
describe('AuthService', () => {
  let authService: AuthService;

  const mockUserService = {
    findUserByUsername: jest.fn(),
    createUser: jest.fn(),
  };
  const mockMailService = {
    sendWelcomeMail:jest.fn()
  }

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

  describe("sign up test", () =>{
      it('sign up success', async() => {
        mockUserService.findUserByUsername.mockResolvedValue(null);
        mockUserService.createUser.mockResolvedValue({id:1})
        mockMailService.sendWelcomeMail.mockResolvedValue(true);
        const result = await authService.signup({username:"user1", email:"user1@gmail.com", password:"abcd!234"})
        expect(result).toEqual({msg:"success"})
      });

    it("sign up throws error for existing username", async() => {
      mockUserService.findUserByUsername.mockResolvedValue({username:"user1", email:"user1@gmail.com", password:"abcd!234"});
      await expect(
        authService.signup({username:"user1", email:"user1@gmail.com", password:"abcd!234"})
      ).rejects.toThrow(); 
    })
  })
  
});
