import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<users[]> {
    return this.prisma.users.findMany();
  }

  async getUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    const foundData = await this.prisma.users.findUnique({
      where,
    });

    if (foundData) {
      return this.prisma.users.findUnique({
        where,
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저를 조회했습니다.');
    }
  }

  async updatePassword(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: params.where,
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(params.data.password, 10);

      return this.prisma.users.update({
        where: params.where,
        data: {
          password: hashedPassword,
        },
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where,
    });
    if (user) {
      return this.prisma.users.delete({
        where,
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
  }
}
