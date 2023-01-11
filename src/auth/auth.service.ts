import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email, password): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return user;
      }
    }

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
      const hashedPassword = await bcrypt.hash(data.password, 10);

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
