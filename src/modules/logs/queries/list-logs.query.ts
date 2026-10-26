import { IQuery } from '@nestjs/cqrs';
import { ListLogsDto } from '../dto/log.dto';

export class ListLogsQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly filters: ListLogsDto,
  ) {}
}
