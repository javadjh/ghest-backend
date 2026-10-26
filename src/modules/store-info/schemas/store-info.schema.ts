import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreInfoDocument = StoreInfo & Document;

@Schema({ timestamps: true, versionKey: false })
export class StoreInfo extends Document {
  @Prop({ required: true, trim: true, default: 'فروشگاه موبایل' })
  name: string;

  @Prop({ trim: true, default: '' })
  owner: string;

  @Prop({ trim: true, default: '' })
  phone: string;

  @Prop({ trim: true, default: '' })
  address: string;

  @Prop({ trim: true, default: '' })
  taxId: string;

  @Prop({ trim: true, default: '' })
  economicCode: string;

  @Prop({ trim: true, default: '' })
  logo: string;

  @Prop({ trim: true, default: '' })
  footerNote: string;

  @Prop({ trim: true, default: '' })
  invoicePrefix: string;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const StoreInfoSchema = SchemaFactory.createForClass(StoreInfo);
