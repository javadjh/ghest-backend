import { Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CqrsModule } from '@nestjs/cqrs';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { SalesModule } from 'src/modules/sales/sales.module';
import { InstallmentsModule } from 'src/modules/installments/installments.module';
import { PaymentsModule } from 'src/modules/payments/payments.module';
import { FilesModule } from 'src/modules/files/files.module';
import { StoreInfoModule } from 'src/modules/store-info/store-info.module';
import { DashboardModule } from 'src/modules/dashboard/dashboard.module';
import { ReportsModule } from 'src/modules/reports/reports.module';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { LogsModule } from 'src/modules/logs/logs.module';
import { LoggerModule } from 'src/common/utils/logger.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { APP_CQRS } from './app.cqrs';

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
    MongooseModule.forRoot(
      // 'mongodb://yourAdminUsername:A_NEW_VERY_STRONG_PASSWORD@127.0.0.1:27017/scan_db?authSource=admin',
      'mongodb://127.0.0.1:27017/installment_db',
    ),
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
