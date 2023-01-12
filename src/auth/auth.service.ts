import { Injectable, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUserExist(email: string): Promise<User> {
    console.log('요청을 이용한 실제 검증 동작');
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) return user;
    return null;
  }

  async validateUser(email, password): Promise<User> {
    console.log('요청을 이용한 실제 이메일, 비밀번호 검증 동작');
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const isMatch = await argon2.verify(user.password, password);

      if (isMatch) {
        return user;
      }
    }

    return null;
  }

  @UseGuards(AuthGuard('local'))
  async login(data: CreateUserDto): Promise<User> {
    console.log('로그인 동작');
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    return user;
  }

  @UseGuards(AuthGuard('check'))
  async register(data: CreateUserDto): Promise<User> {
    console.log('회원가입 동작');

    const hashedPassword = await argon2.hash(data.password);
    // return this.prisma.user.create({
    //   data: {
    //     email: data.email,
    //     password: hashedPassword,
    //   },
    // });
    return;
  }
}
