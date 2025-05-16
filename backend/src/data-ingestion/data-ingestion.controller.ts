import { Controller, Get, Query } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';

@Controller('data-ingestion')
export class DataIngestionController {
  constructor(private readonly service: DataIngestionService) {}

  @Get()
  async getDataByDates(@Query('startDate') startDate?: string) {
    return await this.service.getDataByDates(startDate);
  }
}
