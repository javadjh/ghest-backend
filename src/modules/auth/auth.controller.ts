import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginCommand } from './commands/login.command';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GetCurrentUserQuery } from './queries/get-current-user.query';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('احراز هویت')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'ورود به سیستم و دریافت توکن JWT' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto, description: 'ورود موفقیت‌آمیز' })
  @ApiUnauthorizedResponse({ description: 'نام کاربری یا رمز نادرست' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.commandBus.execute(
      new LoginCommand(
        dto.username,
        dto.password,
        (req.headers['x-forwarded-for'] as string) || req.ip,
      ),
    );
  }

  @Get('me')
  @ApiAuth()
  @ApiOperation({ summary: 'دریافت اطلاعات کاربر جاری' })
  async me(@CurrentUser('sub') userId: string) {
    return this.queryBus.execute(new GetCurrentUserQuery(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiAuth()
  @ApiOperation({ summary: 'خروج از سیستم' })
  async logout(@CurrentUser() user: any) {
    // JWT is stateless; client should discard the token
    return { message: 'خروج با موفقیت انجام شد' };
  }
}
