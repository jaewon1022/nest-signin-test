import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<User[]> {
    const searchedData = await this.prisma.user.findMany();

    if (searchedData.length > 0) {
      return this.prisma.user.findMany();
    } else {
      throw new NotFoundException('조회할 수 있는 유저가 없습니다.');
    }
  }

  async getUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const foundData = await this.prisma.user.findUnique({
      where,
    });

    if (foundData) {
      return this.prisma.user.findUnique({
        where,
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저를 조회했습니다.');
    }
  }

  async updatePassword(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: params.where,
    });

    if (user) {
      const hashedPassword = await argon2.hash(`${params.data.password}`);

      return this.prisma.user.update({
        where: params.where,
        data: {
          password: hashedPassword,
        },
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where,
    });
    if (user) {
      return this.prisma.user.delete({
        where,
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
  }
}
