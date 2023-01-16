import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';

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
        const payload = { email: user.email, sub: user.user_id };

        await this.prisma.user.update({
          where: { email: user.email },
          data: {
            access_token: this.jwtService.sign(payload),
          },
        });

        return user;
      }
    }

    return null;
  }

  async login(data: CreateUserDto): Promise<Object> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: {
        user_id: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    const payload = { email: user.email, userId: user.user_id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
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
