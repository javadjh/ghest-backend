import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UpdateStoreInfoDto, StoreInfoResponseDto } from './dto/store-info.dto';
import { GetStoreInfoQuery } from './queries/get-store-info.query';
import { UpdateStoreInfoCommand } from './commands/update-store-info.command';

@ApiTags('اطلاعات فروشگاه')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('store-info')
export class StoreInfoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'دریافت اطلاعات فروشگاه' })
  async get(): Promise<StoreInfoResponseDto> {
    return this.queryBus.execute(new GetStoreInfoQuery());
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Put()
  @ApiOperation({ summary: 'به‌روزرسانی اطلاعات فروشگاه' })
  async update(
    @Body() dto: UpdateStoreInfoDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<StoreInfoResponseDto> {
    return this.commandBus.execute(
      new UpdateStoreInfoCommand(dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }
}
