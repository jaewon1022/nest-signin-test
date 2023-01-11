import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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

  async register(data: CreateUserDto): Promise<users> {
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
}
