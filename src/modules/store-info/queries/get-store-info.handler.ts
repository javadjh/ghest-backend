import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetStoreInfoQuery } from 'src/modules/store-info/queries/get-store-info.query';
import { StoreInfoService } from 'src/modules/store-info/store-info.service';
import { StoreInfoResponseDto } from 'src/modules/store-info/dto/store-info.dto';

@QueryHandler(GetStoreInfoQuery)
export class GetStoreInfoHandler implements IQueryHandler<
  GetStoreInfoQuery,
  StoreInfoResponseDto
> {
  constructor(private readonly storeInfoService: StoreInfoService) {}

  async execute(): Promise<StoreInfoResponseDto> {
    const s = await this.storeInfoService.getOrCreate();
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
