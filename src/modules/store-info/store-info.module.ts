import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreInfo, StoreInfoSchema } from './schemas/store-info.schema';
import { StoreInfoService } from './store-info.service';
import { StoreInfoController } from './store-info.controller';
import { GetStoreInfoHandler } from './queries/get-store-info.handler';
import { UpdateStoreInfoHandler } from './commands/update-store-info.handler';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StoreInfo.name, schema: StoreInfoSchema }]),
    CqrsModule,
    LogsModule,
  ],
  controllers: [StoreInfoController],
  providers: [StoreInfoService, GetStoreInfoHandler, UpdateStoreInfoHandler],
  exports: [StoreInfoService],
})
export class StoreInfoModule {}
