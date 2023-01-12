import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CheckStrategy extends PassportStrategy(Strategy, 'check') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string): Promise<boolean> {
    console.log('회원가입 전 이메일 검증 시작');
    const isExist = await this.authService.validateUserExist(email);

    if (isExist) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    return true;
  }
}
