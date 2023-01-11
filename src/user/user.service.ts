import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    const foundData = await this.prisma.users.findUnique({
      where,
    });

    if (foundData) {
      return this.prisma.users.findUnique({
        where,
      });
    } else {
      throw new NotFoundException(`존재하지 않는 유저를 조회했습니다.`);
    }
  }

  async getUsers(): Promise<users[]> {
    return this.prisma.users.findMany();
  }

  async createUser(data: CreateUserDto): Promise<users> {
    // check if users already exists
    const userExists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!userExists) {
      return this.prisma.users.create({
        data,
      });
    } else {
      throw new ConflictException(`이 이메일은 이미 사용중입니다.`);
    }
  }

  async updateUser(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    return this.prisma.users.delete({
      where,
    });
  }
}
