import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DataConsumptionService } from '../../src/data-consumption/data-consumption.service';
import { BalanceElectricoModel } from '../../src/models/db-models/balance-electrico.schema';

const mockBalanceElectricoModel = {
  find: jest.fn(),
};

describe('DataConsumptionService', () => {
  let service: DataConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataConsumptionService,
        {
          provide: getModelToken(BalanceElectricoModel.name),
          useValue: mockBalanceElectricoModel,
        },
      ],
    }).compile();

    service = module.get<DataConsumptionService>(DataConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
