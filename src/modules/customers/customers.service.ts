import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerDocument> {
    return this.customerModel.create({
      fullName: dto.fullName,
      phone: dto.phone || '',
      nationalId: dto.nationalId || '',
      address: dto.address || '',
      notes: dto.notes || '',
      totalPurchases: 0,
    });
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerDocument> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException('مشتری یافت نشد');
    Object.assign(customer, {
      fullName: dto.fullName ?? customer.fullName,
      phone: dto.phone ?? customer.phone,
      nationalId: dto.nationalId ?? customer.nationalId,
      address: dto.address ?? customer.address,
      notes: dto.notes ?? customer.notes,
    });
    return customer.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('مشتری یافت نشد');
  }

  async findById(id: string): Promise<CustomerDocument | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return this.customerModel.findById(id).exec();
  }

  async list(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ items: CustomerDocument[]; total: number }> {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.customerModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.customerModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async updateTotalPurchases(id: string, increment: number): Promise<void> {
    await this.customerModel
      .updateOne({ _id: id }, { $inc: { totalPurchases: increment } })
      .exec();
  }
}
