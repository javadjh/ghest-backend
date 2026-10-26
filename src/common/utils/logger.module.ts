import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppLoggerService } from './app-logger.service';
import { Log, LogSchema } from 'src/modules/logs/schemas/log.schema';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
