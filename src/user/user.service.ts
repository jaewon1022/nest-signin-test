import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
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

  async createUser(data: CreateUserDto): Promise<users> {
    const userExists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return this.prisma.users.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });
    } else {
      throw new ConflictException('이 이메일은 이미 사용중입니다.');
    }
  }

  async login(data: CreateUserDto): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);
      console.log(isMatch);
      if (isMatch) {
        console.log('로그인 처리');
        return user;
      }

      throw new NotFoundException('이메일 또는 비밀번호가 일치하지 않습니다.');
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다.');
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
