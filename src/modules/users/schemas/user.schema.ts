import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
}

@Schema({ timestamps: true, versionKey: false, _id: true })
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.OPERATOR })
  role: UserRole;

  @Prop({ trim: true, default: '' })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  // auto-declared by Mongoose timestamps option
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 }, { unique: true });
