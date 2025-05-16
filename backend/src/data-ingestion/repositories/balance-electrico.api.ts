import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as dateFns from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { ReeBalanceElectricoResponseDto } from '../dto/ree-balance-electrico-response.dto';

@Injectable()
export class BalanceElectricoApi {
  constructor(private readonly http: HttpService) {}

  async getDataDayByDay(criteria: BalanceElectricoCriteria): Promise<ReeBalanceElectricoResponseDto> {
    return (
      await lastValueFrom(
        this.http.get<ReeBalanceElectricoResponseDto>('https://apidatos.ree.es/es/datos/balance/balance-electrico', {
          params: {
            start_date: `${dateFns.format(
              criteria.startDate,
              'yyyy-MM-dd',
            )}T${dateFns.format(criteria.startDate, 'HH:mm')}`,
            end_date: `${dateFns.format(criteria.endDate, 'yyyy-MM-dd')}T${dateFns.format(criteria.endDate, 'HH:mm')}`,
            time_trunc: 'day',
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }),
      )
    ).data;
  }
}

export interface BalanceElectricoCriteria {
  startDate: Date;
  endDate: Date;
}
