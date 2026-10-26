import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UpdateInstallmentCommand } from '@/modules/installments/commands/update-installment.command';
import { InstallmentsService } from '@/modules/installments/installments.service';
import { AppLoggerService } from '@/common/utils/app-logger.service';
import { LogAction } from '@/modules/logs/schemas/log.schema';
import { InstallmentResponseDto } from '@/modules/installments/dto/installment.dto';

@CommandHandler(UpdateInstallmentCommand)
export class UpdateInstallmentHandler implements ICommandHandler<UpdateInstallmentCommand, InstallmentResponseDto> {
  constructor(
    private readonly installmentsService: InstallmentsService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: UpdateInstallmentCommand): Promise<InstallmentResponseDto> {
    const inst = await this.installmentsService.update(cmd.id, cmd.dto);
    await this.logger.log({
      action: LogAction.UPDATE,
      entity: 'Installment',
      entityId: cmd.id,
      description: `به‌روزرسانی قسط ${inst.installmentNumber} مشتری ${inst.customerName}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: cmd.dto,
    });
    return this.toDto(inst);
  }

  private toDto(inst: any): InstallmentResponseDto {
    return {
      id: (inst._id as any).toString(),
      saleId: inst.saleId.toString(),
      customerId: inst.customerId.toString(),
      customerName: inst.customerName,
      installmentNumber: inst.installmentNumber,
      dueDate: inst.dueDate,
      monthKey: inst.monthKey,
      expectedAmount: inst.expectedAmount,
      paidAmount: inst.paidAmount,
      status: inst.status,
      paidDate: inst.paidDate,
      notes: inst.notes,
      lateDays: inst.lateDays,
      penaltyAmount: inst.penaltyAmount,
      paymentIds: (inst.paymentIds || []).map((p) => p.toString()),
      createdAt: inst.createdAt,
      updatedAt: inst.updatedAt,
    };
  }
}
