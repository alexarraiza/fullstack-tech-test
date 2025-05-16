import { Test, TestingModule } from '@nestjs/testing';
import { DataIngestionController } from '../../src/data-ingestion/data-ingestion.controller';
import { DataIngestionService } from '../../src/data-ingestion/data-ingestion.service';

const mockDataIngestionService = {};

describe('DataIngestionController', () => {
  let controller: DataIngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataIngestionController],
      providers: [
        {
          provide: DataIngestionService,
          useValue: mockDataIngestionService,
        },
      ],
    }).compile();

    controller = module.get<DataIngestionController>(DataIngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
