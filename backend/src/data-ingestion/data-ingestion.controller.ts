import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { IngestionResponseDto } from './dto/ingestion-response.dto';

@Controller('data-ingestion')
export class DataIngestionController {
  constructor(private readonly service: DataIngestionService) {}

  @Get()
  async getDataByDates(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('replace') replace?: boolean,
  ): Promise<IngestionResponseDto> {
    const result = await this.service.getDataManually(startDate, endDate, replace);

    if (!result.success) {
      throw new InternalServerErrorException(result);
    }

    return result;
  }
}
