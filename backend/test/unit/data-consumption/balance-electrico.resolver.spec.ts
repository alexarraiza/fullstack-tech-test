import { Test, TestingModule } from '@nestjs/testing';
import { BalanceElectricoResolver } from '../../../src/data-consumption/balance-electrico.resolver';
import { DataConsumptionService } from '../../../src/data-consumption/data-consumption.service';

const mockDataConsumptionService = {};

describe('BalanceElectricoResolver', () => {
  let resolver: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceElectricoResolver,
        {
          provide: DataConsumptionService,
          useValue: mockDataConsumptionService,
        },
      ],
    }).compile();

    resolver = module.get<BalanceElectricoResolver>(BalanceElectricoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
