import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetCurrentUserQuery } from './get-current-user.query';
import { UsersService } from '../../users/users.service';
import { CurrentUserResponseDto } from '../dto/login-response.dto';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler
  implements IQueryHandler<GetCurrentUserQuery, CurrentUserResponseDto>
{
  constructor(private readonly usersService: UsersService) {}

  async execute(query: GetCurrentUserQuery): Promise<CurrentUserResponseDto> {
    const user = await this.usersService.findById(query.userId);
    if (!user) throw new NotFoundException('کاربر یافت نشد');
    return {
      id: (user._id as any).toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    };
  }
}
