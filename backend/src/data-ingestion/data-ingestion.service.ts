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
    const { data: apiData, error: apiError } = await tryCatch(
      this.balanceElectricoApi.getDataDayByDay({
        startDate: dateFns.startOfYesterday(),
      }),
    );

    if (apiError) {
      return {
        apiError,
      };
    }

    const balanceElectricoParsedData: IBalanceElectrico[] =
      apiData.included.flatMap((data) =>
        data.attributes.content.map((balance) => ({
          type: balance.type,
          date: new Date(balance.attributes.values[0].datetime),
          value: balance.attributes.values[0].value,
        })),
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
