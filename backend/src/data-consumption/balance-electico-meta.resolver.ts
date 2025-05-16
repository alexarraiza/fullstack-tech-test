import { Query, Resolver } from '@nestjs/graphql';
import { DataConsumptionService } from './data-consumption.service';
import { BalanceElectricoMeta } from './models/balance-electrico-meta.model';

@Resolver(() => BalanceElectricoMeta)
export class BalanceElectricoMetaResolver {
  constructor(private dataConsumptionService: DataConsumptionService) {}

  @Query(() => [BalanceElectricoMeta], { name: 'meta' })
  async meta() {
    return await this.dataConsumptionService.getMeta();
  }
}
