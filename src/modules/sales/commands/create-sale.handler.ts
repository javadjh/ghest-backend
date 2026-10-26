import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSaleCommand } from '@/modules/sales/commands/create-sale.command';
import { SalesService } from '@/modules/sales/sales.service';
import { AppLoggerService } from '@/common/utils/app-logger.service';
import { LogAction } from '@/modules/logs/schemas/log.schema';
import { SaleResponseDto } from '@/modules/sales/dto/sale.dto';
import { PersianDate } from '@/common/utils/persian-date';

@CommandHandler(CreateSaleCommand)
export class CreateSaleHandler implements ICommandHandler<CreateSaleCommand, SaleResponseDto> {
  constructor(
    private readonly salesService: SalesService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: CreateSaleCommand): Promise<SaleResponseDto> {
    const sale = await this.salesService.create(cmd.dto, cmd.actorId);
    await this.logger.log({
      action: LogAction.CREATE,
      entity: 'Sale',
      entityId: (sale._id as any).toString(),
      description: `فروش جدید برای مشتری ${sale.customerName} - ${sale.phone} - مبلغ فروش ${sale.salePrice}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: {
        purchasePrice: sale.purchasePrice,
        salePrice: sale.salePrice,
        installmentCount: sale.installmentCount,
      },
    });
    return this.toResponseDto(sale);
  }

  private toResponseDto(sale: any): SaleResponseDto {
    return {
      id: (sale._id as any).toString(),
      customerId: sale.customerId?.toString?.() || sale.customerId,
      customerName: sale.customerName,
      phone: sale.phone,
      imei: sale.imei,
      phoneCustomer: sale.phoneCustomer,
      saleDate: sale.saleDate,
      purchasePrice: sale.purchasePrice,
      salePrice: sale.salePrice,
      downPayment: sale.downPayment,
      installmentCount: sale.installmentCount,
      monthlyProfitRate: sale.monthlyProfitRate,
      totalProfit: sale.totalProfit,
      profitPerInstallment: sale.profitPerInstallment,
      repaymentAmount: sale.repaymentAmount,
      installmentAmount: sale.installmentAmount,
      loanAmount: sale.loanAmount,
      saleProfit: sale.saleProfit,
      startMonth: sale.startMonth,
      endMonth: sale.endMonth,
      guarantees: sale.guarantees,
      status: sale.status,
      notes: sale.notes,
      createdBy: sale.createdBy?.toString?.() || sale.createdBy,
      totalPaid: sale.totalPaid,
      remainingBalance: sale.remainingBalance,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
  }
}
