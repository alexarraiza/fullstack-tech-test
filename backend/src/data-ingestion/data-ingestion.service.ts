import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dateFns from 'date-fns';
import { tryCatch } from 'src/shared/tryCatch';
import { IngestionResponseDto } from './dto/ingestion-response.dto';
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
    await this.getDataByDates(undefined, undefined, true);
  }
  async getDataByDates(
    startDate?: string,
    endDate?: string,
    replace?: boolean,
  ): Promise<IngestionResponseDto> {
    const startDateParam = startDate
      ? dateFns.startOfDay(Date.parse(startDate))
      : dateFns.startOfYesterday();
    const endDateParam = endDate
      ? dateFns.endOfDay(Date.parse(endDate))
      : dateFns.endOfYesterday();

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
