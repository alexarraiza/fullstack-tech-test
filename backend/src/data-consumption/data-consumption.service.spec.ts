import { Test, TestingModule } from '@nestjs/testing';
import { DataConsumptionService } from './data-consumption.service';

describe('DataConsumptionService', () => {
  let service: DataConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataConsumptionService],
    }).compile();

    service = module.get<DataConsumptionService>(DataConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
