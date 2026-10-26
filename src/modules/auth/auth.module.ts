import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';
import { AuthController } from './auth.controller';
import { LoginHandler } from './commands/login.handler';
import { GetCurrentUserHandler } from './queries/get-current-user.handler';
import { JwtStrategyService } from './strategies/jwt.strategy';

@Module({
  imports: [CqrsModule, UsersModule, LogsModule],
  controllers: [AuthController],
  providers: [LoginHandler, GetCurrentUserHandler, JwtStrategyService],
  exports: [JwtStrategyService],
})
export class AuthModule {}
