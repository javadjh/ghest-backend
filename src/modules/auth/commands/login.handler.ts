import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginCommand } from './login.command';
import { UsersService } from '../../users/users.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';
import { LoginResponseDto } from '../dto/login-response.dto';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResponseDto> {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: LoginCommand): Promise<LoginResponseDto> {
    const user = await this.usersService.findByUsername(cmd.username);
    if (!user) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور نادرست است');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری شما غیرفعال است');
    }

    const isMatch = await bcrypt.compare(cmd.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور نادرست است');
    }

    const payload = {
      sub: (user._id as any).toString(),
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';

    await this.logger.log({
      action: LogAction.LOGIN,
      entity: 'User',
      entityId: payload.sub,
      description: `ورود کاربر ${user.username} به سیستم`,
      userId: payload.sub,
      username: user.username,
      ip: cmd.ip,
    });

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: payload.sub,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
