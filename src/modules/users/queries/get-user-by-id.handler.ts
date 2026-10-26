import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUserByIdQuery } from 'src/modules/users/queries/get-user-by-id.query';
import { UsersService } from 'src/modules/users/users.service';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<
  GetUserByIdQuery,
  UserResponseDto
> {
  constructor(private readonly usersService: UsersService) {}

  async execute(query: GetUserByIdQuery): Promise<UserResponseDto> {
    const u = await this.usersService.findById(query.id);
    if (!u) throw new NotFoundException('کاربر یافت نشد');
    return {
      id: (u._id as any).toString(),
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}
