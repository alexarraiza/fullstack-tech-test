import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as dateFns from 'date-fns';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BalanceElectricoApi {
  constructor(private readonly http: HttpService) {}

  async getDataDayByDay(
    criteria: BalanceElectricoCriteria,
  ): Promise<BalanceElectricoDto> {
    const endDate = criteria.endDate ?? dateFns.addDays(criteria.startDate, 1);
    return (
      await lastValueFrom(
        this.http.get<BalanceElectricoDto>(
          'https://apidatos.ree.es/es/datos/balance/balance-electrico',
          {
            params: {
              start_date: `${dateFns.format(
                criteria.startDate,
                'yyyy-MM-dd',
              )}T${dateFns.format(criteria.startDate, 'HH:mm')}`,
              end_date: `${dateFns.format(
                endDate,
                'yyyy-MM-dd',
              )}T${dateFns.format(endDate, 'HH:mm')}`,
              time_trunc: 'day',
            },
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      )
    ).data;
  }
  // getDataMonthByMonth(
  //   criteria: BalanceElectricoCriteria,
  // ): Promise<BalanceElectricoApi> {}
}

export interface BalanceElectricoCriteria {
  startDate: Date;
  endDate?: Date;
}

export interface BalanceElectricoDto {
  data: {
    type: string;
    id: string;
    attributes: {
      title: string;
      'last-update': string;
      description: string;
    };
    meta: {
      'cache-control': {
        cache: string;
        expireAt: string;
      };
    };
  };
  included: Array<{
    type: string;
    id: string;
    attributes: {
      title: string;
      'last-update': string;
      description?: string;
      magnitude: any;
      content: Array<{
        type: string;
        id: string;
        groupId: string;
        attributes: {
          title: string;
          description?: string;
          color: string;
          icon: any;
          type?: string;
          magnitude: any;
          composite: boolean;
          'last-update': string;
          values: Array<{
            value: number;
            percentage: number;
            datetime: string;
          }>;
          total: number;
          'total-percentage': number;
        };
      }>;
    };
  }>;
}
