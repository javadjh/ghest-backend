import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InstallmentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export type InstallmentDocument = Installment & Document;

@Schema({ timestamps: true, versionKey: false })
export class Installment extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Sale' })
  saleId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true, type: Number })
  installmentNumber: number;

  @Prop({ required: true, type: String })
  dueDate: string;

  @Prop({ required: true, type: String })
  monthKey: string;

  @Prop({ required: true, type: Number })
  expectedAmount: number;

  @Prop({ required: true, type: Number, default: 0 })
  paidAmount: number;

  @Prop({ required: true, enum: InstallmentStatus, default: InstallmentStatus.PENDING })
  status: InstallmentStatus;

  @Prop({ type: Date, default: null })
  paidDate: Date | null;

  @Prop({ type: String, trim: true, default: '' })
  notes: string;

  @Prop({ type: Number, default: 0 })
  lateDays: number;

  @Prop({ type: Number, default: 0 })
  penaltyAmount: number;

  @Prop({ type: [Types.ObjectId], ref: 'Payment', default: [] })
  paymentIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
InstallmentSchema.index({ saleId: 1, installmentNumber: 1 });
InstallmentSchema.index({ monthKey: 1 });
InstallmentSchema.index({ status: 1 });
InstallmentSchema.index({ dueDate: 1 });
