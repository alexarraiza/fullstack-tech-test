import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataIngestionController } from './data-ingestion.controller';
import { DataIngestionService } from './data-ingestion.service';
import { BalanceElectricoApi } from './repositories/balance-electrico.api';
import { BalanceElectricoDb } from './repositories/balance-electrico.db';
import {
  BalanceElectricoModel,
  BalanceElectricoSchema,
} from './schemas/balance-electrico.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: BalanceElectricoModel.name, schema: BalanceElectricoSchema },
    ]),
  ],
  controllers: [DataIngestionController],
  providers: [DataIngestionService, BalanceElectricoApi, BalanceElectricoDb],
})
export class DataIngestionModule {}
