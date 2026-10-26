import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum GuaranteeType {
  CHEQUE = 'cheque',
  GOLD = 'gold',
  OTHER = 'other',
  NONE = 'none',
}

export enum SaleStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
  CANCELLED = 'cancelled',
}

@Schema({ _id: false })
export class Guarantee {
  @Prop({ required: true, enum: GuaranteeType, default: GuaranteeType.NONE })
  type: GuaranteeType;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ trim: true, default: '' })
  chequeNumber: string;

  @Prop({ trim: true, default: '' })
  chequeBank: string;

  @Prop({ trim: true, default: '' })
  chequeDate: string;

  @Prop({ type: Number, default: 0 })
  chequeAmount: number;

  @Prop({ trim: true, default: '' })
  goldType: string;

  @Prop({ type: Number, default: 0 })
  goldWeight: number;

  @Prop({ type: Number, default: 0 })
  goldKarat: number;
}

export const GuaranteeSchema = SchemaFactory.createForClass(Guarantee);

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true, versionKey: false })
export class Sale extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  customerName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, default: '' })
  imei: string;

  @Prop({ trim: true, default: '' })
  phoneCustomer: string;

  @Prop({ required: true })
  saleDate: string;

  @Prop({ required: true, type: Number })
  purchasePrice: number;

  @Prop({ required: true, type: Number })
  salePrice: number;

  @Prop({ required: true, type: Number, default: 0 })
  downPayment: number;

  @Prop({ required: true, type: Number })
  installmentCount: number;

  @Prop({ required: true, type: Number })
  monthlyProfitRate: number;

  @Prop({ required: true, type: Number })
  totalProfit: number;

  @Prop({ required: true, type: Number })
  profitPerInstallment: number;

  @Prop({ required: true, type: Number })
  repaymentAmount: number;

  @Prop({ required: true, type: Number })
  installmentAmount: number;

  @Prop({ required: true, type: Number })
  loanAmount: number;

  @Prop({ required: true, type: Number })
  saleProfit: number;

  @Prop({ required: true, type: String })
  startMonth: string;

  @Prop({ required: true, type: String })
  endMonth: string;

  @Prop({
    type: [GuaranteeSchema],
    default: [],
  })
  guarantees: any[];

  @Prop({ required: true, enum: SaleStatus, default: SaleStatus.ACTIVE })
  status: SaleStatus;

  @Prop({ type: String, trim: true, default: '' })
  notes: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalPaid: number;

  @Prop({ type: Number, default: 0 })
  remainingBalance: number;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
SaleSchema.index({ customerId: 1 });
SaleSchema.index({ saleDate: 1 });
SaleSchema.index({ status: 1 });
SaleSchema.index({ phone: 'text', imei: 'text' });
