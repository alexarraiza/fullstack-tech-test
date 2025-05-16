import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BalanceElectricoModel } from 'src/data-ingestion/schemas/balance-electrico.schema';
import { tryCatch } from 'src/shared/tryCatch';

@Injectable()
export class DataConsumptionService {
  constructor(
    @InjectModel(BalanceElectricoModel.name)
    private balanceModel: Model<BalanceElectricoModel>,
  ) {}

  async findAll(filters: FilterCriteria) {
    const mongooseFilter: Record<string, any> = {};

    if (filters?.type) {
      mongooseFilter.type = filters.type;
    }

    if (filters?.group) {
      mongooseFilter.group = filters.group;
    }

    if (filters?.startDate || filters?.endDate) {
      mongooseFilter.date = {};
      if (filters.startDate) {
        mongooseFilter.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        mongooseFilter.date.$lte = filters.endDate;
      }
    }

    const { data, error } = await tryCatch(
      this.balanceModel.find(mongooseFilter).sort({
        date: 1,
      }),
    );

    if (error) {
      throw error;
    }

    return data;
  }

  async findAllGroups() {
    const { data, error } = await tryCatch(
      this.balanceModel.find().distinct('group'),
    );

    if (error) {
      throw error;
    }

    return data;
  }

  async findAllTypes(group?: string) {
    const mongooseFilter: Record<string, any> = {};

    if (group) {
      mongooseFilter.group = group;
    }

    const { data, error } = await tryCatch(
      this.balanceModel.find(mongooseFilter).distinct('type'),
    );

    if (error) {
      throw error;
    }

    return data;
  }

  async getMeta() {
    const { data: count, error: countError } = await tryCatch(
      this.balanceModel.countDocuments(),
    );
    const { data: maxDate, error: maxDateError } = await tryCatch(
      this.balanceModel.findOne().sort({ date: -1 }),
    );
    const { data: minDate, error: minDateError } = await tryCatch(
      this.balanceModel.findOne().sort({ date: 1 }),
    );

    if (countError || maxDateError || minDateError) {
      throw countError || maxDateError || minDateError;
    }

    if (count && maxDate && minDate) {
      return [
        {
          count,
          maxDate: maxDate.date,
          minDate: minDate.date,
        },
      ];
    }
  }
}

export interface FilterCriteria {
  type?: string;
  group?: string;
  startDate?: Date;
  endDate?: Date;
}
