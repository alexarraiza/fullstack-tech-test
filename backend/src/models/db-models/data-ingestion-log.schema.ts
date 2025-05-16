import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum DataIngestionLogType {
  ON_MODULE_INIT = 'onModuleInit',
  CRON = 'cron',
  MANUAL = 'manual',
}

@Schema({ timestamps: true })
export class DataIngestionLogModel extends Document {
  @Prop({
    type: Date,
    required: true,
  })
  startDate: Date;

  @Prop({
    type: Date,
    required: true,
  })
  endDate: Date;

  @Prop({ type: Boolean, required: true })
  success: boolean;

  @Prop({ type: String, enum: DataIngestionLogType, required: true })
  type: DataIngestionLogType;

  @Prop({ type: String, required: false })
  message: string;
}

export const DataIngestionLogSchema = SchemaFactory.createForClass(DataIngestionLogModel);
