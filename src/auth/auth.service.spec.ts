import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
    verify: jest.fn().mockReturnValue({ id: 'mocked-user-id' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    };

    it('should create a new user and return a token', async () => {
      const hashedPassword = 'hashed-password';
      const mockUser = {
        _id: 'mocked-user-id',
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(mockUserModel, 'create').mockResolvedValue(mockUser);

      const result = await authService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(result).toEqual({ token: 'mocked-token' });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john.doe@example.com',
      password: '123456',
    };

    it('should return a token if login is successful', async () => {
      const hashedPassword = 'hashed-password';
      const mockUser = {
        _id: 'mocked-user-id',
        email: loginDto.email,
        password: hashedPassword,
      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser._id });
      expect(result).toEqual({ token: 'mocked-token' });
    });

    it('should throw UnauthorizedException if email is not found', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const hashedPassword = 'hashed-password';
      const mockUser = {
        _id: 'mocked-user-id',
        email: loginDto.email,
        password: hashedPassword,
      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });
  });

  describe('isLoggedIn', () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer mocked-token',
      },
    } as any;

    it('should return true if the token is valid', () => {
      const result = authService.isLoggedIn(mockRequest);

      expect(mockJwtService.verify).toHaveBeenCalledWith('mocked-token');
      expect(result).toBe(true);
    });

    it('should return false if there is no authorization header', () => {
      delete mockRequest.headers.authorization;

      const result = authService.isLoggedIn(mockRequest);

      expect(result).toBe(false);
    });

    it('should return false if the token is invalid', () => {
      jest.spyOn(mockJwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      const result = authService.isLoggedIn(mockRequest);

      expect(mockJwtService.verify).toHaveBeenCalledWith('mocked-token');
      expect(result).toBe(false);
    });
  });
});
