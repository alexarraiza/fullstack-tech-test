import { Query, Resolver } from '@nestjs/graphql';
import { BalanceElectricoMeta } from '../models/graphql-models/balance-electrico-meta.model';
import { DataConsumptionService } from './data-consumption.service';

@Resolver(() => BalanceElectricoMeta)
export class BalanceElectricoMetaResolver {
  constructor(private dataConsumptionService: DataConsumptionService) {}

  @Query(() => [BalanceElectricoMeta], { name: 'meta' })
  async meta() {
    return await this.dataConsumptionService.getMeta();
  }
}
