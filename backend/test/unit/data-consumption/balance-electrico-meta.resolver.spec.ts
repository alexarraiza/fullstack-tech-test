import { Test, TestingModule } from '@nestjs/testing';
import { BalanceElectricoMetaResolver } from '../../../src/data-consumption/balance-electico-meta.resolver';
import { DataConsumptionService } from '../../../src/data-consumption/data-consumption.service';

const mockDataConsumptionService = {};

describe('BalanceElectricoMetaResolver', () => {
  let resolver: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceElectricoMetaResolver,
        {
          provide: DataConsumptionService,
          useValue: mockDataConsumptionService,
        },
      ],
    }).compile();

    resolver = module.get(BalanceElectricoMetaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
