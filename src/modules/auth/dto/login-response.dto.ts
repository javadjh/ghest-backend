import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/modules/users/schemas/user.schema';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  expiresIn: string;

  @ApiProperty()
  user: {
    id: string;
    username: string;
    fullName: string;
    role: UserRole;
  };
}

export class CurrentUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  isActive: boolean;
}
