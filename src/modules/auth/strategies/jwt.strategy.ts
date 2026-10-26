import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../../../common/guards/jwt-auth.guard';

@Injectable()
export class JwtStrategyService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validatePayload(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('کاربر غیرفعال یا حذف شده است');
    }
    return {
      id: (user._id as any).toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
