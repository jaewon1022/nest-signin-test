import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private transporter: Mail;

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

  async sendVerifyCode(email: string): Promise<string> {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const payload = {
      email,
    };

    const signupVerifyToken = this.jwtService.sign(payload, {
      expiresIn: '1m',
    });

    const url = `http://localhost:3000/email/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions = {
      from: 'test@noreply.com',
      to: email,
      subject: '가입 인증 메일',
      html: `
      가입 확인 버튼을 누르시면 가입 인증이 완료됩니다.<br />
      인증번호는 1분간 유효합니다.<br />
      <form action="${url}" method="post">
      <button>가입 확인</button>
      </form>
      `,
    };

    this.transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });

    return signupVerifyToken;
  }

  async verifyEmail(signupToken: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(signupToken, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload);
      if (typeof payload === 'object' && payload.hasOwnProperty('email')) {
        return payload;
      }
      throw new BadRequestException('토큰이 유효하지 않습니다.');
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('토큰 유효기간이 만료되었습니다.');
      }
      throw new BadRequestException('토큰이 유효하지 않습니다.');
    }
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
