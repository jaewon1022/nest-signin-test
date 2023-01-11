import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email, password): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const isMatch = await argon2.verify(user.password, password);

      if (isMatch) {
        return user;
      }
    }
    console.log('guard error! 매칭되는 유저가 없습니다.');

    return null;
  }

  async login(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    return user;
  }

  async register(data: CreateUserDto): Promise<User> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!userExists) {
      console.log(data.password);
      const hashedPassword = await argon2.hash(data.password);
      console.log(hashedPassword);

      return this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });
    } else {
      throw new ConflictException('이 이메일은 이미 사용중입니다.');
    }
  }
}
