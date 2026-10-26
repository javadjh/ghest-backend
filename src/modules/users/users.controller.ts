import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ApiAuth } from '@/common/decorators/api-auth.decorator';
import { UserRole } from '@/modules/users/schemas/user.schema';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from '@/modules/users/dto/user.dto';
import { UserResponseDto, PaginatedUsersDto } from '@/modules/users/dto/user-response.dto';
import { CreateUserCommand } from '@/modules/users/commands/create-user.command';
import { UpdateUserCommand } from '@/modules/users/commands/update-user.command';
import { DeleteUserCommand } from '@/modules/users/commands/delete-user.command';
import { ResetPasswordCommand } from '@/modules/users/commands/reset-password.command';
import { ListUsersQuery } from '@/modules/users/queries/list-users.query';
import { GetUserByIdQuery } from '@/modules/users/queries/get-user-by-id.query';

@ApiTags('کاربران')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'لیست کاربران (تنها مدیر)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ): Promise<PaginatedUsersDto> {
    return this.queryBus.execute(
      new ListUsersQuery(
        Number(page) || 1,
        Number(limit) || 20,
        search,
        role,
        isActive === undefined ? undefined : isActive === 'true',
      ),
    );
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'دریافت یک کاربر' })
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'ایجاد کاربر جدید' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    return this.commandBus.execute(
      new CreateUserCommand(dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'به‌روزرسانی کاربر' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    return this.commandBus.execute(
      new UpdateUserCommand(id, dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'حذف کاربر' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteUserCommand(id, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Roles(UserRole.ADMIN)
  @Post(':id/reset-password')
  @ApiOperation({ summary: 'بازنشانی رمز عبور کاربر' })
  async resetPassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.commandBus.execute(
      new ResetPasswordCommand(id, dto.newPassword, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }
}
