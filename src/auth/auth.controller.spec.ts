import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockToken = 'mock-token';

  const mockSignUpDto: SignUpDto = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password',
  };

  const mockLoginDto: LoginDto = {
    email: 'johndoe@example.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({ token: mockToken }),
            login: jest.fn().mockResolvedValue({ token: mockToken }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should return the token when sign up is successful', async () => {
      const result = await controller.signUp(mockSignUpDto);
      expect(result).toEqual({ token: mockToken });
    });
  });

  describe('login', () => {
    it('should return the token when login is successful', async () => {
      const result = await controller.login(mockLoginDto);
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw UnauthorizedException when login is unsuccessful', async () => {
      (service.login as jest.Mock).mockRejectedValueOnce(
        new UnauthorizedException('Invalid email or password'),
      );

      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
