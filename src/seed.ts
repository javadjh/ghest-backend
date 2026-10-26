import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/users.service';
import { UserRole } from 'src/modules/users/schemas/user.schema';
import { LoggerModule } from 'src/common/utils/logger.module';
import { Log, LogSchema } from 'src/modules/logs/schemas/log.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'change-me',
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/installment_db'),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    LoggerModule,
    CqrsModule,
    UsersModule,
  ],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });
  const usersService = app.get(UsersService);

  const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin12345';

  await usersService.ensureSeed(
    username,
    password,
    'مدیر سیستم',
    UserRole.ADMIN,
  );
  await usersService.ensureSeed(
    'operator',
    'operator123',
    'اپراتور سیستم',
    UserRole.OPERATOR,
  );

  console.log('✅ Seed completed: admin/' + username);
  await app.close();
  process.exit(0);
}

bootstrap().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
