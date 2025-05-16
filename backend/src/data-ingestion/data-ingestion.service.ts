import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import * as dateFns from 'date-fns';
import { Model } from 'mongoose';
import { tryCatch } from 'src/shared/tryCatch';
import { IngestionResponseDto } from './dto/ingestion-response.dto';
import { BalanceElectricoApi } from './repositories/balance-electrico.api';
import { BalanceElectricoDb } from './repositories/balance-electrico.db';
import { IBalanceElectrico } from './schemas/balance-electrico.schema';
import {
  DataIngestionLogModel,
  DataIngestionLogType,
} from './schemas/data-ingestion-log.schema';

@Injectable()
export class DataIngestionService implements OnModuleInit {
  constructor(
    private readonly balanceElectricoApi: BalanceElectricoApi,
    private readonly balanceElectricoDb: BalanceElectricoDb,

    @InjectModel(DataIngestionLogModel.name)
    private dataIngLog: Model<DataIngestionLogModel>,
  ) {}

  async onModuleInit() {
    const lastSuccessfulSync = await this.dataIngLog.findOne({
      success: true,
    });

    if (!lastSuccessfulSync) {
      const startDate = dateFns.startOfMonth(new Date());
      const endDate = dateFns.endOfDay(dateFns.endOfYesterday());

      const newSyncResult = await this.getDataByDates(
        dateFns.format(startDate, 'yyyy-MM-dd'),
        dateFns.format(endDate, 'yyyy-MM-dd'),
        true,
      );

      const newSyncLog = new this.dataIngLog({
        startDate: startDate,
        endDate: endDate,
        type: DataIngestionLogType.ON_MODULE_INIT,
        success: newSyncResult.success,
        message: newSyncResult.message,
      });
      await this.dataIngLog.create(newSyncLog);
    }
  }

  @Cron('0 3 * * *')
  async getData() {
    const lastSuccessfulSync = await this.dataIngLog
      .findOne({
        success: true,
        type: DataIngestionLogType.CRON,
      })
      .sort({ syncTimestamp: -1 });

    const startDate = lastSuccessfulSync
      ? dateFns.startOfDay(lastSuccessfulSync.endDate)
      : dateFns.startOfMonth(new Date());
    const endDate = dateFns.endOfDay(dateFns.endOfYesterday());

    const newSyncResult = await this.getDataByDates(
      dateFns.format(startDate, 'yyyy-MM-dd'),
      dateFns.format(endDate, 'yyyy-MM-dd'),
      true,
    );

    const newSyncLog = new this.dataIngLog({
      startDate: startDate,
      endDate: endDate,
      type: DataIngestionLogType.CRON,
      success: newSyncResult.success,
      message: newSyncResult.message,
    });
    await this.dataIngLog.create(newSyncLog);
  }

  async getDataManually(
    startDate: string,
    endDate: string,
    replace?: boolean,
  ): Promise<IngestionResponseDto> {
    const newSyncResult = await this.getDataByDates(
      dateFns.format(startDate, 'yyyy-MM-dd'),
      dateFns.format(endDate, 'yyyy-MM-dd'),
      replace ?? false,
    );

    const newSyncLog = new this.dataIngLog({
      startDate: startDate,
      endDate: endDate,
      type: DataIngestionLogType.MANUAL,
      success: newSyncResult.success,
      message: newSyncResult.message,
    });
    await this.dataIngLog.create(newSyncLog);

    return newSyncResult;
  }

  private async getDataByDates(
    startDate: string,
    endDate: string,
    replace: boolean,
  ): Promise<IngestionResponseDto> {
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

    const balanceElectricoParsedData: IBalanceElectrico[] =
      apiData.included.flatMap((data) =>
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
      const minDate = new Date(
        Math.min(...balanceElectricoParsedData.map((d) => d.date.getTime())),
      );
      const maxDate = new Date(
        Math.max(...balanceElectricoParsedData.map((d) => d.date.getTime())),
      );
      const { error: dbError } = await tryCatch(
        this.balanceElectricoDb.BalanceElectricoBetweenDates(minDate, maxDate),
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
      this.balanceElectricoDb.persistBalanceElectricoBulk(
        balanceElectricoParsedData,
      ),
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
