import { Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_CQRS } from './app.cqrs';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SalesModule } from './modules/sales/sales.module';
import { InstallmentsModule } from './modules/installments/installments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FilesModule } from './modules/files/files.module';
import { StoreInfoModule } from './modules/store-info/store-info.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { LogsModule } from './modules/logs/logs.module';
import { LoggerModule } from './common/utils/logger.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

const globalGuards: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
];

function buildGlobalJwtModule() {
  return JwtModule.registerAsync({
    global: true,
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET') || 'change-me',
      signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '7d' },
    }),
    inject: [ConfigService],
  });
}
const globalJwtModule = buildGlobalJwtModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/installment_db',
      }),
      inject: [ConfigService],
    }),
    globalJwtModule,
    LoggerModule,
    APP_CQRS,
    AuthModule,
    UsersModule,
    CustomersModule,
    SalesModule,
    InstallmentsModule,
    PaymentsModule,
    FilesModule,
    StoreInfoModule,
    DashboardModule,
    ReportsModule,
    InvoicesModule,
    LogsModule,
  ],
  providers: [...globalGuards],
})
export class AppModule {}
