import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  readonly email: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9가-힣]{1,}$/, {
    message: '이름에 공백, 특수 문자를 포함할 수 없습니다.',
  })
  readonly name: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(()_+])(?=.{8,})/, {
    message:
      '비밀번호는 대문자, 특수 문자를 포함해 최소 8자리 이상이어야 합니다.',
  })
  readonly password: string;
}
