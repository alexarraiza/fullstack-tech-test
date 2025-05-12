import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IBalanceElectrico {
  date: Date;
  type: string;
  value: number;
}

@Schema({ timestamps: true })
export class BalanceElectricoModel extends Document {
  @Prop({
    type: Date,
    required: true,
  })
  date: Date;

  @Prop({ type: String, required: true })
  type: string;

  @Prop()
  value: number;
}

export const BalanceElectricoSchema = SchemaFactory.createForClass(
  BalanceElectricoModel,
);

BalanceElectricoSchema.index({ date: 1, type: 1 }, { unique: true });
