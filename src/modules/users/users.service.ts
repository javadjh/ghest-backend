import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '@/modules/users/schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from '@/modules/users/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    const u = await this.userModel.findOne({ username: username.trim() }).exec();
    return u || null;
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) return null;
    return this.userModel.findById(id).exec();
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ username: dto.username.trim() }).exec();
    if (existing) {
      throw new ConflictException('این نام کاربری قبلاً ثبت شده است');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      username: dto.username.trim(),
      password,
      fullName: dto.fullName,
      role: dto.role || UserRole.OPERATOR,
      phone: dto.phone || '',
      isActive: dto.isActive ?? true,
    });

    const { password: _, ...rest } = created.toObject();
    return created;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    return user.save();
  }

  async delete(id: string, actorId: string): Promise<void> {
    if (id === actorId) {
      throw new BadRequestException('نمی‌توانید حساب خودتان را حذف کنید');
    }
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('کاربر یافت نشد');
    }
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async list(
    page: number,
    limit: number,
    search?: string,
    role?: string,
    isActive?: boolean,
  ): Promise<{ items: UserDocument[]; total: number }> {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.userModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async ensureSeed(username: string, password: string, fullName: string, role: UserRole): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ username }).exec();
    if (existing) return existing;
    const hashed = await bcrypt.hash(password, 10);
    return this.userModel.create({ username, password: hashed, fullName, role, isActive: true });
  }
}
