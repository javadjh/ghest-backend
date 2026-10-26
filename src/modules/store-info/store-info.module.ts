import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { StoreInfo, StoreInfoSchema } from '@/modules/store-info/schemas/store-info.schema';
import { StoreInfoService } from '@/modules/store-info/store-info.service';
import { StoreInfoController } from '@/modules/store-info/store-info.controller';
import { GetStoreInfoHandler } from '@/modules/store-info/queries/get-store-info.handler';
import { UpdateStoreInfoHandler } from '@/modules/store-info/commands/update-store-info.handler';
import { LogsModule } from '@/modules/logs/logs.module';

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
