import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers()', () => {
    it('return user arrays', async () => {
      const result = await service.getUsers();

      expect(result).toBeInstanceOf(Array);
    });
  });
  // describe('getUser()', () => {});
  // describe('createUser()', () => {});
  // describe('updatePassword()', () => {});
  // describe('deleteUser()', () => {});
});
