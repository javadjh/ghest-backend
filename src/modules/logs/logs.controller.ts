import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ListLogsDto } from './dto/log.dto';
import { ListLogsQuery } from './queries/list-logs.query';

@ApiTags('لاگ‌ها')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'لیست لاگ‌های سیستم' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() filters: ListLogsDto,
  ) {
    return this.queryBus.execute(
      new ListLogsQuery(Number(page) || 1, Number(limit) || 20, filters),
    );
  }
}
