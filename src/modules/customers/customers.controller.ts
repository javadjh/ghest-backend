import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto } from './dto/customer.dto';
import { CreateCustomerCommand } from './commands/create-customer.command';
import { UpdateCustomerCommand } from './commands/update-customer.command';
import { DeleteCustomerCommand } from './commands/delete-customer.command';
import { ListCustomersQuery } from './queries/list-customers.query';
import { GetCustomerByIdQuery } from './queries/get-customer-by-id.query';

@ApiTags('مشتریان')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'لیست مشتریان' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.queryBus.execute(new ListCustomersQuery(Number(page) || 1, Number(limit) || 20, search));
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت اطلاعات یک مشتری' })
  async getById(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.queryBus.execute(new GetCustomerByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'ایجاد مشتری جدید' })
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<CustomerResponseDto> {
    return this.commandBus.execute(
      new CreateCustomerCommand(dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'به‌روزرسانی مشتری' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<CustomerResponseDto> {
    return this.commandBus.execute(
      new UpdateCustomerCommand(id, dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مشتری' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteCustomerCommand(id, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }
}
