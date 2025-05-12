import { Controller, Get } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';

@Controller('data-ingestion')
export class DataIngestionController {
  constructor(private readonly service: DataIngestionService) {}

  @Get()
  async getData() {
    return await this.service.getData();
  }
}
