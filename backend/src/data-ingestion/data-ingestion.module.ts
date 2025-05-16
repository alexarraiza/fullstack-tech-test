import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceElectricoModel, BalanceElectricoSchema } from '../models/db-models/balance-electrico.schema';
import { DataIngestionLogModel, DataIngestionLogSchema } from '../models/db-models/data-ingestion-log.schema';
import { DataIngestionController } from './data-ingestion.controller';
import { DataIngestionService } from './data-ingestion.service';
import { BalanceElectricoApi } from './repositories/balance-electrico.api';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: BalanceElectricoModel.name, schema: BalanceElectricoSchema },
      { name: DataIngestionLogModel.name, schema: DataIngestionLogSchema },
    ]),
  ],
  controllers: [DataIngestionController],
  providers: [DataIngestionService, BalanceElectricoApi],
})
export class DataIngestionModule {}
