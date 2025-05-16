import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BalanceElectricoModel,
  IBalanceElectrico,
} from '../schemas/balance-electrico.schema';

@Injectable()
export class BalanceElectricoDb {
  constructor(
    @InjectModel(BalanceElectricoModel.name)
    private balanceModel: Model<BalanceElectricoModel>,
  ) {}
  async persistBalanceElectrico(balance: IBalanceElectrico) {
    return await this.balanceModel.create(balance);
  }
  async persistBalanceElectricoBulk(balance: IBalanceElectrico[]) {
    return await this.balanceModel.create(balance, {
      aggregateErrors: true,
    });
  }
  async BalanceElectricoBetweenDates(startDate: Date, endDate: Date) {
    return await this.balanceModel.deleteMany({
      date: { $gte: startDate, $lte: endDate },
    });
  }
}
