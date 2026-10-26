import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UpdateStoreInfoCommand } from 'src/modules/store-info/commands/update-store-info.command';
import { StoreInfoService } from 'src/modules/store-info/store-info.service';
import { AppLoggerService } from 'src/common/utils/app-logger.service';
import { LogAction } from 'src/modules/logs/schemas/log.schema';
import { StoreInfoResponseDto } from 'src/modules/store-info/dto/store-info.dto';

@CommandHandler(UpdateStoreInfoCommand)
export class UpdateStoreInfoHandler implements ICommandHandler<
  UpdateStoreInfoCommand,
  StoreInfoResponseDto
> {
  constructor(
    private readonly storeInfoService: StoreInfoService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: UpdateStoreInfoCommand): Promise<StoreInfoResponseDto> {
    const s = await this.storeInfoService.update(cmd.dto);
    await this.logger.log({
      action: LogAction.CONFIG,
      entity: 'StoreInfo',
      entityId: (s._id as any).toString(),
      description: `به‌روزرسانی اطلاعات فروشگاه: ${s.name}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: cmd.dto,
    });
    return {
      id: (s._id as any).toString(),
      name: s.name,
      owner: s.owner,
      phone: s.phone,
      address: s.address,
      taxId: s.taxId,
      economicCode: s.economicCode,
      logo: s.logo,
      footerNote: s.footerNote,
      invoicePrefix: s.invoicePrefix,
    };
  }
}
