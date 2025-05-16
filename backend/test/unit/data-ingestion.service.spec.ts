import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DataIngestionService } from '../../src/data-ingestion/data-ingestion.service';
import { BalanceElectricoApi } from '../../src/data-ingestion/repositories/balance-electrico.api';
import { BalanceElectricoModel } from '../../src/models/db-models/balance-electrico.schema';
import { DataIngestionLogModel } from '../../src/models/db-models/data-ingestion-log.schema';

const mockBalanceElectricoApi = {};

const mockBalanceElectricoModel = {
  find: jest.fn(),
};

const mockDataIngestionLogModel = {
  findOne: jest.fn(),
};

describe('DataIngestionService', () => {
  let service: DataIngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataIngestionService,
        {
          provide: BalanceElectricoApi,
          useValue: mockBalanceElectricoApi,
        },
        {
          provide: getModelToken(DataIngestionLogModel.name),
          useValue: mockBalanceElectricoModel,
        },
        {
          provide: getModelToken(BalanceElectricoModel.name),
          useValue: mockDataIngestionLogModel,
        },
      ],
    }).compile();

    service = module.get<DataIngestionService>(DataIngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should get data and save it if there is none on the db', async () => {
      // TODO
    });

    it('should not get data and save it if there is already data on the db', async () => {
      // TODO
    });

    it('should get data from the start of the current month until end of yesterday', async () => {
      // TODO
    });

    it('should save a log if successfully gets data and saves it', async () => {
      // TODO
    });

    it('should save a log if fails to get data and save it', async () => {
      // TODO
    });
  });
});
