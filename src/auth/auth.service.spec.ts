import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    it('return invalid user', async () => {
      const result = await service.validateUser(
        'invalidUser',
        'invalidPassword',
      );

      expect(result).toBeNull();
    });

    it('return valid user', async () => {
      const user = await prisma.user.findUnique({
        where: {
          email: 'yjaewon1022@gmail.com',
        },
      });

      const result = await service.validateUser(
        'yjaewon1022@gmail.com',
        'Test@123',
      );

      expect(result).toEqual(user);
    });
  });

  describe('register()', () => {
    it('return already existing email', async () => {
      const userData = {
        email: 'andyjaewon@naver.com',
      };

      const user = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
        select: {
          user_id: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      expect(user).not.toBeNull();
    });

    it('return able to create', async () => {
      const userData = {
        email: 'testForRegister@naver.com',
      };

      const user = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
        select: {
          user_id: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      });

      expect(user).toBeNull();
    });
  });

  describe('login()', () => {
    it('return unexisting user', async () => {
      const result = await service.login({
        email: '',
        password: '',
      });

      expect(result).toBeNull();
    });

    it('return existing user', async () => {
      const user = await prisma.user.findUnique({
        where: {
          email: 'andyjaewon@naver.com',
        },
      });

      const result = await service.login({
        email: 'andyjaewon@naver.com',
        password: 'Test@123',
      });

      expect(result).toEqual(user);
    });
  });
});
