import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { NonPWUser } from 'src/@types/user';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(): Promise<NonPWUser[]> {
    const searchedData = await this.prismaService.user.findMany({
      select: {
        user_id: true,
        email: true,
        created_at: true,
        updated_at: true,
        access_token: true,
      },
      orderBy: { created_at: 'desc' },
    });

    if (searchedData.length > 0) {
      return searchedData;
    } else {
      throw new NotFoundException('조회할 수 있는 유저가 없습니다.');
    }
  }

  async getUser(email: string): Promise<NonPWUser> {
    if (email) {
      const foundData = await this.prismaService.user.findUnique({
        where: { email },
        select: {
          user_id: true,
          email: true,
          created_at: true,
          updated_at: true,
          access_token: true,
        },
      });

      if (foundData) {
        return foundData;
      } else {
        throw new NotFoundException('존재하지 않는 유저를 조회했습니다.');
      }
    } else {
      throw new NotFoundException('이메일을 입력해주세요.');
    }
  }

  async updatePassword(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: params.where,
    });

    if (user) {
      const hashedPassword = await argon2.hash(`${params.data.password}`);

      return this.prismaService.user.update({
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
    const user = await this.prismaService.user.findUnique({
      where,
    });
    if (user) {
      return this.prismaService.user.delete({
        where,
      });
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
  }
}
