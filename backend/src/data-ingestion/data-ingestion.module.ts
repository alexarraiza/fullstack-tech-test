import { Module } from '@nestjs/common';
import { DataIngestionController } from './data-ingestion.controller';

@Module({
  controllers: [DataIngestionController],
})
export class DataIngestionModule {}
