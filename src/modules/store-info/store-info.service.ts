import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreInfo, StoreInfoDocument } from '@/modules/store-info/schemas/store-info.schema';
import { UpdateStoreInfoDto } from '@/modules/store-info/dto/store-info.dto';

@Injectable()
export class StoreInfoService {
  constructor(
    @InjectModel(StoreInfo.name) private readonly storeModel: Model<StoreInfoDocument>,
  ) {}

  async getOrCreate(): Promise<StoreInfoDocument> {
    let doc = await this.storeModel.findOne().exec();
    if (!doc) {
      doc = await this.storeModel.create({});
    }
    return doc;
  }

  async update(dto: UpdateStoreInfoDto): Promise<StoreInfoDocument> {
    const doc = await this.getOrCreate();
    Object.assign(doc, {
      name: dto.name ?? doc.name,
      owner: dto.owner ?? doc.owner,
      phone: dto.phone ?? doc.phone,
      address: dto.address ?? doc.address,
      taxId: dto.taxId ?? doc.taxId,
      economicCode: dto.economicCode ?? doc.economicCode,
      logo: dto.logo ?? doc.logo,
      footerNote: dto.footerNote ?? doc.footerNote,
      invoicePrefix: dto.invoicePrefix ?? doc.invoicePrefix,
    });
    return doc.save();
  }
}
