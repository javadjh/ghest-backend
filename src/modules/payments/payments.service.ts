import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Installment, InstallmentDocument, InstallmentStatus } from '../installments/schemas/installment.schema';
import { Sale, SaleDocument, SaleStatus } from '../sales/schemas/sale.schema';
import { CreatePaymentDto } from './dto/payment.dto';
import { FilesService } from '../files/files.service';
import { PersianDate } from '../../common/utils/persian-date';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    private readonly filesService: FilesService,
  ) {}

  async create(dto: CreatePaymentDto, userId: string): Promise<PaymentDocument> {
    const installment = await this.installmentModel.findById(dto.installmentId).exec();
    if (!installment) {
      throw new NotFoundException('قسط یافت نشد');
    }

    const sale = await this.saleModel.findById(installment.saleId).exec();
    if (!sale) {
      throw new NotFoundException('فروش مربوطه یافت نشد');
    }

    // Validate amount
    const remaining = installment.expectedAmount - installment.paidAmount;
    if (dto.amount > remaining + 100) {
      // allow small overpayment tolerance for rounding
      throw new BadRequestException(
        `مبلغ پرداختی بیش از مانده قسط است (مانده: ${remaining})`,
      );
    }

    // Validate file if provided
    let fileDoc: any = null;
    if (dto.receiptFileId) {
      fileDoc = await this.filesService.getById(dto.receiptFileId);
    }

    const payment = await this.paymentModel.create({
      saleId: sale._id,
      installmentId: installment._id,
      customerId: installment.customerId,
      customerName: installment.customerName,
      amount: dto.amount,
      paymentDate: dto.paymentDate,
      paymentMethod: dto.paymentMethod || 'cash',
      receiptFileId: fileDoc ? (fileDoc._id as any) : null,
      receiptFileName: fileDoc?.filename || fileDoc?.originalName || '',
      receiptOriginalName: fileDoc?.originalName || '',
      notes: dto.notes || '',
      createdBy: new Types.ObjectId(userId),
    });

    // Update installment
    installment.paidAmount = (installment.paidAmount || 0) + dto.amount;
    installment.paymentIds.push(payment._id as any);
    if (installment.paidAmount >= installment.expectedAmount) {
      installment.status = InstallmentStatus.PAID;
      installment.paidDate = new Date();
    } else if (installment.paidAmount > 0) {
      installment.status = InstallmentStatus.PARTIAL;
    }
    await installment.save();

    // Recalculate sale totals
    const allInstallments = await this.installmentModel.find({ saleId: sale._id }).exec();
    const totalPaid = allInstallments.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const allPaid = allInstallments.every((i) =>
      [InstallmentStatus.PAID, InstallmentStatus.CANCELLED].includes(i.status),
    );
    sale.totalPaid = totalPaid;
    sale.remainingBalance = Math.max(0, sale.repaymentAmount - totalPaid);
    if (allPaid && allInstallments.length > 0) {
      sale.status = SaleStatus.COMPLETED;
    }
    await sale.save();

    return payment;
  }

  async delete(id: string): Promise<void> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) throw new NotFoundException('پرداختی یافت نشد');

    // Revert installment
    const installment = await this.installmentModel.findById(payment.installmentId).exec();
    if (installment) {
      installment.paidAmount = Math.max(0, (installment.paidAmount || 0) - payment.amount);
      installment.paymentIds = installment.paymentIds.filter((p) => p.toString() !== id);
      if (installment.paidAmount === 0) {
        installment.status = InstallmentStatus.PENDING;
        installment.paidDate = null;
      } else if (installment.paidAmount < installment.expectedAmount) {
        installment.status = InstallmentStatus.PARTIAL;
      }
      await installment.save();

      // Recalc sale
      const sale = await this.saleModel.findById(payment.saleId).exec();
      if (sale) {
        const all = await this.installmentModel.find({ saleId: sale._id }).exec();
        const totalPaid = all.reduce((s, i) => s + (i.paidAmount || 0), 0);
        const allPaid = all.every((i) =>
          [InstallmentStatus.PAID, InstallmentStatus.CANCELLED].includes(i.status),
        );
        sale.totalPaid = totalPaid;
        sale.remainingBalance = Math.max(0, sale.repaymentAmount - totalPaid);
        if (allPaid && all.length > 0) {
          sale.status = SaleStatus.COMPLETED;
        } else if (sale.status === SaleStatus.COMPLETED) {
          sale.status = SaleStatus.ACTIVE;
        }
        await sale.save();
      }
    }

    await this.paymentModel.deleteOne({ _id: id }).exec();
  }

  async findById(id: string): Promise<PaymentDocument | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return this.paymentModel.findById(id).exec();
  }

  async list(
    page: number,
    limit: number,
    filters: any,
  ): Promise<{ items: PaymentDocument[]; total: number }> {
    const filter: any = {};
    if (filters.search) {
      filter.customerName = { $regex: filters.search, $options: 'i' };
    }
    if (filters.customerId) filter.customerId = new Types.ObjectId(filters.customerId);
    if (filters.saleId) filter.saleId = new Types.ObjectId(filters.saleId);
    if (filters.fromDate || filters.toDate) {
      filter.paymentDate = {};
      if (filters.fromDate) filter.paymentDate.$gte = filters.fromDate;
      if (filters.toDate) filter.paymentDate.$lte = filters.toDate;
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.paymentModel.find(filter).sort({ paymentDate: -1 }).skip(skip).limit(limit).exec(),
      this.paymentModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async findByInstallment(installmentId: string): Promise<PaymentDocument[]> {
    if (!installmentId || !Types.ObjectId.isValid(installmentId)) return [];
    return this.paymentModel
      .find({ installmentId: new Types.ObjectId(installmentId) })
      .sort({ paymentDate: 1 })
      .exec();
  }

  getUrl(file: any): string {
    return file ? `/uploads/${file.filename}` : '';
  }
}
