import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UpdateSaleCommand } from 'src/modules/sales/commands/update-sale.command';
import { SalesService } from 'src/modules/sales/sales.service';
import { AppLoggerService } from 'src/common/utils/app-logger.service';
import { LogAction } from 'src/modules/logs/schemas/log.schema';
import { SaleResponseDto } from 'src/modules/sales/dto/sale.dto';

@CommandHandler(UpdateSaleCommand)
export class UpdateSaleHandler implements ICommandHandler<
  UpdateSaleCommand,
  SaleResponseDto
> {
  constructor(
    private readonly salesService: SalesService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: UpdateSaleCommand): Promise<SaleResponseDto> {
    const sale = await this.salesService.update(cmd.id, cmd.dto);
    await this.logger.log({
      action: LogAction.UPDATE,
      entity: 'Sale',
      entityId: cmd.id,
      description: `به‌روزرسانی فروش ${sale.customerName} - ${sale.phone}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: cmd.dto,
    });
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
