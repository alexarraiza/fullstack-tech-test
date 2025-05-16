import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceElectricoModel, BalanceElectricoSchema } from 'src/models/db-models/balance-electrico.schema';
import { BalanceElectricoMetaResolver } from './balance-electico-meta.resolver';
import { BalanceElectricoResolver } from './balance-electrico.resolver';
import { DataConsumptionService } from './data-consumption.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: BalanceElectricoModel.name, schema: BalanceElectricoSchema }])],
  providers: [DataConsumptionService, BalanceElectricoResolver, BalanceElectricoMetaResolver],
})
export class DataConsumptionModule {}
