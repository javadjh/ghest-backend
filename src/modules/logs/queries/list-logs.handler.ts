import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersianDate } from 'src/common/utils/persian-date';
import { ListLogsQuery } from './list-logs.query';
import { Log, LogDocument } from '../schemas/log.schema';
import { LogResponseDto } from '../dto/log.dto';

@QueryHandler(ListLogsQuery)
export class ListLogsHandler implements IQueryHandler<
  ListLogsQuery,
  { items: LogResponseDto[]; total: number; page: number; limit: number }
> {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {}

  async execute(query: ListLogsQuery): Promise<{
    items: LogResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const filter: any = {};
    if (query.filters.search) {
      filter.$or = [
        { description: { $regex: query.filters.search, $options: 'i' } },
        { username: { $regex: query.filters.search, $options: 'i' } },
      ];
    }
    if (query.filters.action) filter.action = query.filters.action;
    if (query.filters.entity) filter.entity = query.filters.entity;
    if (query.filters.fromDate || query.filters.toDate) {
      const from = query.filters.fromDate
        ? PersianDate.toGregorian(query.filters.fromDate)
        : null;
      const to = query.filters.toDate
        ? PersianDate.toGregorian(query.filters.toDate)
        : null;
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = from;
      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = endOfDay;
      }
    }

    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.logModel
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(query.limit)
        .exec(),
      this.logModel.countDocuments(filter).exec(),
    ]);
    return {
      items: items.map((l) => ({
        id: (l._id as any).toString(),
        action: l.action,
        entity: l.entity,
        entityId: l.entityId,
        description: l.description,
        username: l.username,
        ip: l.ip,
        details: l.details,
        timestamp: l.timestamp,
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
