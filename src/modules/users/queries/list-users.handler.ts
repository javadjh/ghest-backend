import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ListUsersQuery } from './list-users.query';
import { UsersService } from '../users.service';
import { PaginatedUsersDto, UserResponseDto } from '../dto/user-response.dto';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, PaginatedUsersDto> {
  constructor(private readonly usersService: UsersService) {}

  async execute(query: ListUsersQuery): Promise<PaginatedUsersDto> {
    const { items, total } = await this.usersService.list(
      query.page,
      query.limit,
      query.search,
      query.role,
      query.isActive,
    );
    const mapped: UserResponseDto[] = items.map((u) => ({
      id: (u._id as any).toString(),
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    return {
      items: mapped,
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
