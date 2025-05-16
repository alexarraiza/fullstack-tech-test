import { Args, Query, Resolver } from '@nestjs/graphql';
import { DataConsumptionService } from './data-consumption.service';
import { GetBalancesArgs } from './inputs/get-balances.args';
import { BalanceElectrico } from './models/balance-electrico.model';

@Resolver(() => BalanceElectrico)
export class BalanceElectricoResolver {
  constructor(private dataConsumptionService: DataConsumptionService) {}

  @Query(() => [BalanceElectrico], { name: 'balances' })
  async balancesElectricos(@Args() filter: GetBalancesArgs) {
    return await this.dataConsumptionService.findAll({
      type: filter.type,
      group: filter.group,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
  }

  @Query(() => [String], { name: 'groups' })
  async groups() {
    return await this.dataConsumptionService.findAllGroups();
  }

  @Query(() => [String], { name: 'types' })
  async types(@Args('group', { nullable: true }) group?: string) {
    return await this.dataConsumptionService.findAllTypes(group);
  }
}
