import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sale, SaleDocument, SaleStatus } from './schemas/sale.schema';
import { Installment, InstallmentDocument, InstallmentStatus } from '../installments/schemas/installment.schema';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { calculateSale } from './helpers/sale-calculator';
import { PersianDate } from '../../common/utils/persian-date';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: CreateSaleDto, userId: string): Promise<SaleDocument> {
    const customer = await this.customerModel.findById(dto.customerId).exec();
    if (!customer) {
      throw new NotFoundException('مشتری یافت نشد');
    }

    // Recalculate installments if needed
    const calc = calculateSale({
      purchasePrice: dto.purchasePrice,
      salePrice: dto.salePrice,
      downPayment: dto.downPayment,
      installmentCount: dto.installmentCount,
      monthlyProfitRate: dto.monthlyProfitRate,
      saleDate: dto.saleDate,
    });

    const created = await this.saleModel.create({
      customerId: customer._id as any,
      customerName: customer.fullName,
      phone: dto.phone,
      imei: dto.imei || '',
      phoneCustomer: dto.phoneCustomer || '',
      saleDate: dto.saleDate,
      purchasePrice: dto.purchasePrice,
      salePrice: dto.salePrice,
      downPayment: dto.downPayment,
      installmentCount: dto.installmentCount,
      monthlyProfitRate: dto.monthlyProfitRate,
      totalProfit: calc.totalProfit,
      profitPerInstallment: calc.profitPerInstallment,
      repaymentAmount: calc.repaymentAmount,
      installmentAmount: calc.installmentAmount,
      loanAmount: calc.loanAmount,
      saleProfit: calc.saleProfit,
      startMonth: calc.startMonth,
      endMonth: calc.endMonth,
      guarantees: (dto.guarantees || []).map((g) => ({
        type: g.type,
        description: g.description || '',
        chequeNumber: g.chequeNumber || '',
        chequeBank: g.chequeBank || '',
        chequeDate: g.chequeDate || '',
        chequeAmount: g.chequeAmount || 0,
        goldType: g.goldType || '',
        goldWeight: g.goldWeight || 0,
        goldKarat: g.goldKarat || 0,
      })),
      status: SaleStatus.ACTIVE,
      notes: dto.notes || '',
      createdBy: new Types.ObjectId(userId),
      totalPaid: 0,
      remainingBalance: calc.repaymentAmount,
    });

    // Create installments
    const installmentDocs = calc.installments.map((it) => ({
      saleId: created._id,
      customerId: customer._id,
      customerName: customer.fullName,
      installmentNumber: it.installmentNumber,
      dueDate: it.dueDate,
      monthKey: it.monthKey,
      expectedAmount: it.expectedAmount,
      paidAmount: 0,
      status: InstallmentStatus.PENDING,
      paidDate: null,
      notes: '',
      lateDays: 0,
      penaltyAmount: 0,
      paymentIds: [],
      createdBy: new Types.ObjectId(userId),
    }));
    await this.installmentModel.insertMany(installmentDocs);

    // Update customer's total purchases
    await this.customerModel.updateOne(
      { _id: customer._id },
      { $inc: { totalPurchases: 1 } },
    ).exec();

    return created;
  }

  async update(id: string, dto: UpdateSaleDto): Promise<SaleDocument> {
    const sale = await this.saleModel.findById(id).exec();
    if (!sale) {
      throw new NotFoundException('فروش یافت نشد');
    }

    // Determine if any financial field changed
    const oldPurchase = sale.purchasePrice;
    const oldSalePrice = sale.salePrice;
    const oldDown = sale.downPayment;
    const oldCount = sale.installmentCount;
    const oldRate = sale.monthlyProfitRate;
    const oldDate = sale.saleDate;

    const newPurchase = dto.purchasePrice ?? oldPurchase;
    const newSalePrice = dto.salePrice ?? oldSalePrice;
    const newDown = dto.downPayment ?? oldDown;
    const newCount = dto.installmentCount ?? oldCount;
    const newRate = dto.monthlyProfitRate ?? oldRate;
    const newDate = dto.saleDate ?? oldDate;

    const financialChanged =
      dto.purchasePrice !== undefined ||
      dto.salePrice !== undefined ||
      dto.downPayment !== undefined ||
      dto.installmentCount !== undefined ||
      dto.monthlyProfitRate !== undefined ||
      dto.saleDate !== undefined;

    if (financialChanged) {
      // Check if any payment already exists
      const hasPayments = await this.installmentModel.exists({
        saleId: sale._id,
        paidAmount: { $gt: 0 },
      });
      if (hasPayments) {
        throw new BadRequestException(
          'به دلیل وجود پرداختی ثبت‌شده، نمی‌توانید فیلدهای مالی را تغییر دهید. لطفاً ابتدا پرداختی‌ها را حذف کنید.',
        );
      }

      // Recalculate
      const calc = calculateSale({
        purchasePrice: newPurchase,
        salePrice: newSalePrice,
        downPayment: newDown,
        installmentCount: newCount,
        monthlyProfitRate: newRate,
        saleDate: newDate,
      });

      sale.purchasePrice = newPurchase;
      sale.salePrice = newSalePrice;
      sale.downPayment = newDown;
      sale.installmentCount = newCount;
      sale.monthlyProfitRate = newRate;
      sale.saleDate = newDate;
      sale.totalProfit = calc.totalProfit;
      sale.profitPerInstallment = calc.profitPerInstallment;
      sale.repaymentAmount = calc.repaymentAmount;
      sale.installmentAmount = calc.installmentAmount;
      sale.loanAmount = calc.loanAmount;
      sale.saleProfit = calc.saleProfit;
      sale.startMonth = calc.startMonth;
      sale.endMonth = calc.endMonth;
      sale.remainingBalance = calc.repaymentAmount;

      // Recreate installments
      await this.installmentModel.deleteMany({ saleId: sale._id }).exec();
      const installmentDocs = calc.installments.map((it, idx) => ({
        saleId: sale._id,
        customerId: sale.customerId,
        customerName: sale.customerName,
        installmentNumber: it.installmentNumber,
        dueDate: it.dueDate,
        monthKey: it.monthKey,
        expectedAmount: it.expectedAmount,
        paidAmount: 0,
        status: InstallmentStatus.PENDING,
        paidDate: null,
        notes: '',
        lateDays: 0,
        penaltyAmount: 0,
        paymentIds: [],
        createdBy: sale.createdBy,
      }));
      await this.installmentModel.insertMany(installmentDocs);
    }

    if (dto.phone !== undefined) sale.phone = dto.phone;
    if (dto.imei !== undefined) sale.imei = dto.imei;
    if (dto.phoneCustomer !== undefined) sale.phoneCustomer = dto.phoneCustomer;
    if (dto.notes !== undefined) sale.notes = dto.notes;
    if (dto.guarantees !== undefined) {
      sale.guarantees = dto.guarantees.map((g) => ({
        type: g.type,
        description: g.description || '',
        chequeNumber: g.chequeNumber || '',
        chequeBank: g.chequeBank || '',
        chequeDate: g.chequeDate || '',
        chequeAmount: g.chequeAmount || 0,
        goldType: g.goldType || '',
        goldWeight: g.goldWeight || 0,
        goldKarat: g.goldKarat || 0,
      })) as any;
    }
    if (dto.status !== undefined) sale.status = dto.status;

    return sale.save();
  }

  async delete(id: string): Promise<void> {
    const sale = await this.saleModel.findById(id).exec();
    if (!sale) throw new NotFoundException('فروش یافت نشد');
    // Cascade: delete installments + payments
    await this.installmentModel.deleteMany({ saleId: sale._id }).exec();
    await this.saleModel.deleteOne({ _id: sale._id }).exec();
  }

  async findById(id: string): Promise<SaleDocument | null> {
    if (!id || !Types.ObjectId.isValid(id)) return null;
    return this.saleModel.findById(id).exec();
  }

  async list(
    page: number,
    limit: number,
    filters: {
      search?: string;
      status?: string;
      customerId?: string;
      phoneModel?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<{ items: SaleDocument[]; total: number }> {
    const filter: any = {};
    if (filters.search) {
      filter.$or = [
        { customerName: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { imei: { $regex: filters.search, $options: 'i' } },
        { phoneCustomer: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters.status) filter.status = filters.status;
    if (filters.customerId) filter.customerId = new Types.ObjectId(filters.customerId);
    if (filters.phoneModel) {
      filter.phone = { $regex: filters.phoneModel, $options: 'i' };
    }
    if (filters.fromDate || filters.toDate) {
      filter.saleDate = {};
      if (filters.fromDate) filter.saleDate.$gte = filters.fromDate;
      if (filters.toDate) filter.saleDate.$lte = filters.toDate;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.saleModel.find(filter).sort({ saleDate: -1, createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.saleModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async recalculateTotals(saleId: string): Promise<void> {
    const sale = await this.saleModel.findById(saleId).exec();
    if (!sale) return;

    const installments = await this.installmentModel.find({ saleId }).exec();
    const totalPaid = installments.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const remaining = sale.repaymentAmount - totalPaid;

    sale.totalPaid = totalPaid;
    sale.remainingBalance = remaining < 0 ? 0 : remaining;

    // If all installments paid → mark sale completed
    const allPaid = installments.every((i) =>
      [InstallmentStatus.PAID, InstallmentStatus.CANCELLED].includes(i.status),
    );
    if (allPaid && installments.length > 0) {
      sale.status = SaleStatus.COMPLETED;
    } else if (sale.status === SaleStatus.COMPLETED) {
      sale.status = SaleStatus.ACTIVE;
    }
    await sale.save();
  }
}
