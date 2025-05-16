import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dateFns from 'date-fns';
import { tryCatch } from 'src/shared/tryCatch';
import { BalanceElectricoApi } from './repositories/balance-electrico.api';
import { BalanceElectricoDb } from './repositories/balance-electrico.db';
import { IBalanceElectrico } from './schemas/balance-electrico.schema';

@Injectable()
export class DataIngestionService {
  constructor(
    private readonly balanceElectricoApi: BalanceElectricoApi,
    private readonly balanceElectricoDb: BalanceElectricoDb,
  ) {}

  @Cron('0 3 * * *')
  async getData() {
    await this.getDataByDates();
  }
  async getDataByDates(startDate?: string) {
    const startDateParam = startDate
      ? dateFns.startOfDay(Date.parse(startDate))
      : dateFns.startOfYesterday();

    const { data: apiData, error: apiError } = await tryCatch(
      this.balanceElectricoApi.getDataDayByDay({
        startDate: startDateParam,
        endDate: dateFns.endOfYesterday(),
      }),
    );

    if (apiError) {
      return {
        apiError,
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

    const { data: dbData, error: dbError } = await tryCatch(
      this.balanceElectricoDb.persistBalanceElectricoBulk(
        balanceElectricoParsedData,
      ),
    );

    if (dbError) {
      return {
        dbError,
      };
    }

    return {
      apiData,
      dbData,
    };
  }
}
