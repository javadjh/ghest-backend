import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true, versionKey: false })
export class File extends Document {
  @Prop({ required: true, trim: true })
  originalName: string;

  @Prop({ required: true, trim: true })
  filename: string;

  @Prop({ required: true, trim: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true, trim: true })
  path: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy: Types.ObjectId;

  @Prop({ type: String, default: 'receipt' })
  category: string;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
