import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum LogAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PAYMENT = 'payment',
  PRINT = 'print',
  EXPORT = 'export',
  CONFIG = 'config',
}

export type LogDocument = Log & Document;

@Schema({ timestamps: { createdAt: 'timestamp', updatedAt: false }, versionKey: false })
export class Log extends Document {
  @Prop({ required: true, enum: LogAction })
  action: LogAction;

  @Prop({ trim: true, default: '' })
  entity: string;

  @Prop({ trim: true, default: '' })
  entityId: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true, default: '' })
  userId: string;

  @Prop({ trim: true, default: '' })
  username: string;

  @Prop({ trim: true, default: '' })
  ip: string;

  @Prop({ type: Object, default: {} })
  details: any;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
LogSchema.index({ action: 1 });
LogSchema.index({ timestamp: -1 });
LogSchema.index({ entity: 1 });
