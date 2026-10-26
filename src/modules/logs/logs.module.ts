import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Log, LogSchema } from './schemas/log.schema';
import { LogsController } from './logs.controller';
import { ListLogsHandler } from './queries/list-logs.handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    CqrsModule,
  ],
  controllers: [LogsController],
  providers: [ListLogsHandler],
  exports: [],
})
export class LogsModule {}
