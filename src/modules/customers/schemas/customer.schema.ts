import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, versionKey: false })
export class Customer extends Document {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ trim: true, default: '' })
  phone: string;

  @Prop({ trim: true, default: '' })
  nationalId: string;

  @Prop({ trim: true, default: '' })
  address: string;

  @Prop({ trim: true, default: '' })
  notes: string;

  @Prop({ type: Number, default: 0 })
  totalPurchases: number;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ fullName: 'text', phone: 'text' });
