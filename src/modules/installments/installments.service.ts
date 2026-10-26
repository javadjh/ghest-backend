import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PersianDate } from 'src/common/utils/persian-date';
import {
  Installment,
  InstallmentDocument,
  InstallmentStatus,
} from 'src/modules/installments/schemas/installment.schema';
import { UpdateInstallmentDto } from 'src/modules/installments/dto/installment.dto';
import { SalesService } from 'src/modules/sales/sales.service';

@Injectable()
export class InstallmentsService {
  constructor(
    @InjectModel(Installment.name)
    private readonly installmentModel: Model<InstallmentDocument>,
    private readonly salesService: SalesService,
  ) {}

  async findById(id: string): Promise<InstallmentDocument | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return this.installmentModel.findById(id).exec();
  }

  async findBySale(saleId: string): Promise<InstallmentDocument[]> {
    if (!saleId || !Types.ObjectId.isValid(saleId)) return [];
    return this.installmentModel
      .find({ saleId: new Types.ObjectId(saleId) })
      .sort({ installmentNumber: 1 })
      .exec();
  }

  async list(
    page: number,
    limit: number,
    filters: any,
  ): Promise<{ items: InstallmentDocument[]; total: number }> {
    const filter: any = {};
    if (filters.search) {
      filter.$or = [
        { customerName: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters.status) filter.status = filters.status;
    if (filters.customerId)
      filter.customerId = new Types.ObjectId(filters.customerId);
    if (filters.saleId) filter.saleId = new Types.ObjectId(filters.saleId);
    if (filters.monthKey) filter.monthKey = filters.monthKey;
    if (filters.year) {
      filter.monthKey = { $regex: `^${filters.year}/` };
    }
    if (filters.monthName) {
      // For Persian month name filter, we need to use aggregation pipeline; for simplicity here we filter in-memory
      // We will handle below by fetching all and filtering
      // OR we use a regex on monthName field stored on the doc — we'll add a monthName field for performance
    }
    if (filters.fromDate || filters.toDate) {
      filter.dueDate = {};
      if (filters.fromDate) filter.dueDate.$gte = filters.fromDate;
      if (filters.toDate) filter.dueDate.$lte = filters.toDate;
    }

    const today = PersianDate.now();
    if (filters.overdue === 'true') {
      filter.status = {
        $in: [InstallmentStatus.PENDING, InstallmentStatus.PARTIAL],
      };
      filter.dueDate = { $lt: today };
      if (filters.fromDate || filters.toDate) {
        // override
        filter.dueDate = {
          $lt: today,
          ...(filters.fromDate ? { $gte: filters.fromDate } : {}),
          ...(filters.toDate ? { $lte: filters.toDate } : {}),
        };
      }
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.installmentModel
        .find(filter)
        .sort({ dueDate: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.installmentModel.countDocuments(filter).exec(),
    ]);

    // Late days + penalty recalculation
    for (const it of items) {
      this.updateLateDaysInPlace(it, today);
    }

    // Persian month name filter (post-process)
    let finalItems = items;
    if (filters.monthName) {
      const mn = filters.monthName;
      finalItems = finalItems.filter(
        (i) => PersianDate.monthNameFromDate(i.dueDate) === mn,
      );
    }

    return { items: finalItems, total };
  }

  private updateLateDaysInPlace(
    installment: InstallmentDocument,
    today: string,
  ): void {
    if (
      installment.status === InstallmentStatus.PAID ||
      installment.status === InstallmentStatus.CANCELLED
    ) {
      installment.lateDays = 0;
      return;
    }
    const days = PersianDate.daysBetween(installment.dueDate, today);
    installment.lateDays = days > 0 ? days : 0;
  }

  async refreshLateDays(): Promise<{ updated: number }> {
    const all = await this.installmentModel
      .find({
        status: { $in: [InstallmentStatus.PENDING, InstallmentStatus.PARTIAL] },
      })
      .exec();
    const today = PersianDate.now();
    let updated = 0;
    for (const it of all) {
      const days = PersianDate.daysBetween(it.dueDate, today);
      const newLate = days > 0 ? days : 0;
      if (newLate !== it.lateDays) {
        it.lateDays = newLate;
        await it.save();
        updated++;
      }
    }
    return { updated };
  }

  async update(
    id: string,
    dto: UpdateInstallmentDto,
  ): Promise<InstallmentDocument> {
    const inst = await this.installmentModel.findById(id).exec();
    if (!inst) throw new NotFoundException('قسط یافت نشد');
    if (dto.notes !== undefined) inst.notes = dto.notes;
    if (dto.penaltyAmount !== undefined) inst.penaltyAmount = dto.penaltyAmount;
    if (dto.expectedAmount !== undefined)
      inst.expectedAmount = dto.expectedAmount;
    const saved = await inst.save();
    // Recalculate sale totals
    await this.salesService.recalculateTotals(inst.saleId.toString());
    return saved;
  }

  async addPaymentToInstallment(
    installmentId: string,
    paymentId: string,
    amount: number,
  ): Promise<void> {
    const inst = await this.installmentModel.findById(installmentId).exec();
    if (!inst) throw new NotFoundException('قسط یافت نشد');
    inst.paidAmount = (inst.paidAmount || 0) + amount;
    inst.paymentIds.push(new Types.ObjectId(paymentId) as any);
    if (inst.paidAmount >= inst.expectedAmount) {
      inst.status = InstallmentStatus.PAID;
      inst.paidDate = new Date();
    } else if (inst.paidAmount > 0) {
      inst.status = InstallmentStatus.PARTIAL;
    }
    await inst.save();
  }

  async removePaymentFromInstallment(
    installmentId: string,
    paymentId: string,
    amount: number,
  ): Promise<void> {
    const inst = await this.installmentModel.findById(installmentId).exec();
    if (!inst) throw new NotFoundException('قسط یافت نشد');
    inst.paidAmount = Math.max(0, (inst.paidAmount || 0) - amount);
    inst.paymentIds = inst.paymentIds.filter((p) => p.toString() !== paymentId);
    if (inst.paidAmount === 0) {
      inst.status = InstallmentStatus.PENDING;
      inst.paidDate = null;
    } else if (inst.paidAmount < inst.expectedAmount) {
      inst.status = InstallmentStatus.PARTIAL;
    }
    await inst.save();
  }
}
