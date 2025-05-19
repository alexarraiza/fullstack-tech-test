import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import * as dateFns from 'date-fns';
import { Model } from 'mongoose';
import { tryCatch } from 'src/shared/tryCatch';
import { BalanceElectricoModel } from '../models/db-models/balance-electrico.schema';
import { DataIngestionLogModel, DataIngestionLogType } from '../models/db-models/data-ingestion-log.schema';
import { IngestionResponseDto } from './dto/ingestion-response.dto';
import { BalanceElectricoApi } from './repositories/balance-electrico.api';

@Injectable()
export class DataIngestionService implements OnModuleInit {
  constructor(
    private readonly balanceElectricoApi: BalanceElectricoApi,

    @InjectModel(DataIngestionLogModel.name)
    private readonly dataIngLog: Model<DataIngestionLogModel>,

    @InjectModel(BalanceElectricoModel.name)
    private readonly balanceModel: Model<BalanceElectricoModel>,
  ) {}

  async onModuleInit() {
    const lastSuccessfulSync = await this.dataIngLog.findOne({
      success: true,
    });

    if (!lastSuccessfulSync) {
      const startDate = dateFns.startOfMonth(new Date());
      const endDate = dateFns.endOfYesterday();

      const newSyncResult = await this.getDataByDates(
        dateFns.format(startDate, 'yyyy-MM-dd'),
        dateFns.format(endDate, 'yyyy-MM-dd'),
        true,
      );

      await this.dataIngLog.create({
        startDate: startDate,
        endDate: endDate,
        type: DataIngestionLogType.ON_MODULE_INIT,
        success: newSyncResult.success,
        message: newSyncResult.message,
      });
    }
  }

  @Cron('0 3 * * *')
  async getDataCron() {
    const lastSuccessfulSync = await this.dataIngLog
      .findOne({
        success: true,
        type: DataIngestionLogType.CRON,
      })
      .sort({ syncTimestamp: -1 });

    const startDate = lastSuccessfulSync
      ? dateFns.startOfDay(lastSuccessfulSync.endDate)
      : dateFns.startOfMonth(new Date());
    const endDate = dateFns.endOfYesterday();

    const newSyncResult = await this.getDataByDates(
      dateFns.format(startDate, 'yyyy-MM-dd'),
      dateFns.format(endDate, 'yyyy-MM-dd'),
      true,
    );

    await this.dataIngLog.create({
      startDate: startDate,
      endDate: endDate,
      type: DataIngestionLogType.CRON,
      success: newSyncResult.success,
      message: newSyncResult.message,
    });
  }

  async getDataManually(startDate: string, endDate: string, replace?: boolean): Promise<IngestionResponseDto> {
    const newSyncResult = await this.getDataByDates(
      dateFns.format(startDate, 'yyyy-MM-dd'),
      dateFns.format(endDate, 'yyyy-MM-dd'),
      replace ?? false,
    );

    await this.dataIngLog.create({
      startDate: startDate,
      endDate: endDate,
      type: DataIngestionLogType.MANUAL,
      success: newSyncResult.success,
      message: newSyncResult.message,
    });

    return newSyncResult;
  }

  private async getDataByDates(startDate: string, endDate: string, replace: boolean): Promise<IngestionResponseDto> {
    const startDateParam = dateFns.startOfDay(Date.parse(startDate));
    const endDateParam = dateFns.endOfDay(Date.parse(endDate));

    const { data: apiData, error: apiError } = await tryCatch(
      this.balanceElectricoApi.getDataDayByDay({
        startDate: startDateParam,
        endDate: endDateParam,
      }),
    );

    if (apiError) {
      return {
        success: false,
        message: 'Error fetching data from API',
        error: apiError.toString(),
      };
    }

    if (!apiData?.included || apiData.included.length === 0) {
      return {
        success: false,
        message: 'No data found in API response',
        error: 'No data found in API response',
      };
    }

    const balanceElectricoParsedData = apiData.included.flatMap((data) =>
      data.attributes.content.flatMap((balance) =>
        balance.attributes.values.map((val) => ({
          type: balance.type,
          group: balance.groupId,
          date: new Date(val.datetime),
          value: val.value,
        })),
      ),
    );

    if (replace) {
      const minDate = new Date(Math.min(...balanceElectricoParsedData.map((d) => d.date.getTime())));
      const maxDate = new Date(Math.max(...balanceElectricoParsedData.map((d) => d.date.getTime())));
      const { error: dbError } = await tryCatch(
        this.balanceModel.deleteMany({
          date: { $gte: minDate, $lte: maxDate },
        }),
      );
      if (dbError) {
        return {
          success: false,
          message: 'Error deleting data',
          error: dbError.toString(),
        };
      }
    }

    const { data: dbData, error: dbError } = await tryCatch(
      this.balanceModel.create(balanceElectricoParsedData, {
        aggregateErrors: true,
      }),
    );

    if (dbError) {
      return {
        success: false,
        message: 'Error persisting data',
        error: dbError.toString(),
      };
    }

    if (JSON.stringify(dbData).includes('error')) {
      return {
        success: false,
        message: 'Error persisting data',
        dbData,
      };
    }

    return {
      success: true,
      message: 'Data ingested successfully',
    };
  }
}
