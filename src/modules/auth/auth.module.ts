import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from '@/modules/auth/auth.controller';
import { LoginHandler } from '@/modules/auth/commands/login.handler';
import { GetCurrentUserHandler } from '@/modules/auth/queries/get-current-user.handler';
import { UsersModule } from '@/modules/users/users.module';
import { LogsModule } from '@/modules/logs/logs.module';
import { JwtStrategyService } from '@/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    LogsModule,
  ],
  controllers: [AuthController],
  providers: [LoginHandler, GetCurrentUserHandler, JwtStrategyService],
  exports: [JwtStrategyService],
})
export class AuthModule {}
