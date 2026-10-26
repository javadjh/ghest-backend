import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'نام کاربری' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'admin12345', description: 'رمز عبور' })
  @IsString()
  @MinLength(4)
  password: string;
}
