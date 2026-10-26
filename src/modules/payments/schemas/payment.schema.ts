import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true, versionKey: false })
export class Payment extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Sale' })
  saleId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Installment' })
  installmentId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  paymentDate: string;

  @Prop({ trim: true, default: 'cash' })
  paymentMethod: string;

  @Prop({ type: Types.ObjectId, ref: 'File', default: null })
  receiptFileId: Types.ObjectId | null;

  @Prop({ trim: true, default: '' })
  receiptFileName: string;

  @Prop({ trim: true, default: '' })
  receiptOriginalName: string;

  @Prop({ trim: true, default: '' })
  notes: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ saleId: 1 });
PaymentSchema.index({ installmentId: 1 });
PaymentSchema.index({ paymentDate: 1 });
PaymentSchema.index({ customerId: 1 });
