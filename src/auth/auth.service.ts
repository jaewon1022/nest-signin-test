import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) return true;
    return null;
  }

  async validateUser(email: string, password: string): Promise<User> {
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

  async login(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    const payload = { email: user.email, sub: user.user_id };
    console.log({ accessToken: this.jwtService.sign(payload) });
    return user;
  }

  async register(data: CreateUserDto): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
  }
}
