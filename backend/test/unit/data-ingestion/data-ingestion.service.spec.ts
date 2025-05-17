import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as dateFns from 'date-fns';
import { DataIngestionService } from '../../../src/data-ingestion/data-ingestion.service';
import { IngestionResponseDto } from '../../../src/data-ingestion/dto/ingestion-response.dto';
import { BalanceElectricoApi } from '../../../src/data-ingestion/repositories/balance-electrico.api';
import { BalanceElectricoModel } from '../../../src/models/db-models/balance-electrico.schema';
import { DataIngestionLogModel, DataIngestionLogType } from '../../../src/models/db-models/data-ingestion-log.schema';

const mockBalanceElectricoApi = {};

const mockBalanceElectricoModel = {
  find: jest.fn(),
};

const mockDataIngestionLogModel = {
  constructor: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
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
          useValue: mockDataIngestionLogModel,
        },
        {
          provide: getModelToken(BalanceElectricoModel.name),
          useValue: mockBalanceElectricoModel,
        },
      ],
    }).compile();

    service = module.get<DataIngestionService>(DataIngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call getDataByDates if there is no sync log on the db', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(null);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.onModuleInit();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(getDataByDatesSpy).toHaveBeenCalled();
    });

    it('should not call getDataByDates if there is already a sync log on the db', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockResolvedValueOnce({
        success: true,
        startDate: dateFns.startOfMonth(new Date()),
        endDate: dateFns.endOfYesterday(),
        type: DataIngestionLogType.ON_MODULE_INIT,
        message: 'Data already ingested',
      } as DataIngestionLogModel);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      await service.onModuleInit();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(getDataByDatesSpy).not.toHaveBeenCalled();
    });

    it('should get data from the start of the current month until end of yesterday', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(null);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.onModuleInit();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(getDataByDatesSpy).toHaveBeenCalledWith(
        dateFns.format(dateFns.startOfMonth(new Date()), 'yyyy-MM-dd'),
        dateFns.format(dateFns.endOfYesterday(), 'yyyy-MM-dd'),
        true,
      );
    });

    it('should save a log if successfully gets data and saves it', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(null);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      const createLogResult = {
        startDate: dateFns.startOfMonth(new Date()),
        endDate: dateFns.endOfYesterday(),
        type: DataIngestionLogType.ON_MODULE_INIT,
        success: true,
        message: 'Data successfully ingested',
      } as DataIngestionLogModel;

      await service.onModuleInit();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(mockDataIngestionLogModel.create).toHaveBeenCalledWith(createLogResult);
      expect(getDataByDatesSpy).toHaveBeenCalled();
    });

    it('should save a log if fails to get data and save it', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(null);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: false,
        message: 'Error',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      const createLogResult = {
        startDate: dateFns.startOfMonth(new Date()),
        endDate: dateFns.endOfYesterday(),
        type: DataIngestionLogType.ON_MODULE_INIT,
        success: false,
        message: 'Error',
      } as DataIngestionLogModel;

      await service.onModuleInit();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(mockDataIngestionLogModel.create).toHaveBeenCalledWith(createLogResult);
      expect(getDataByDatesSpy).toHaveBeenCalled();
    });
  });

  describe('getDataCron', () => {
    it('should get data from the last successful sync until yesterday', async () => {
      // TODO
    });
    it('should get data from the start of current month until yesterday if there is no last successful sync', async () => {
      // TODO
    });
    it('should save a sync log if getting the data is successful', async () => {
      // TODO
    });
    it('should save a sync log if getting the data fails', async () => {
      // TODO
    });
  });

  describe('getDataManually', () => {
    it('should call getDataByDates with the provided dates', async () => {
      // TODO
    });
    it('should call getDataByDates with replace set to false if not provided', async () => {
      // TODO
    });
    it('should call getDataByDates with replace set to true if provided', async () => {
      // TODO
    });
    it('should save a sync log if getting the data is successful', async () => {
      // TODO
    });
    it('should save a sync log if getting the data fails', async () => {
      // TODO
    });
  });

  describe('getDataByDates', () => {
    it('should call the BalanceElectricoApi with the provided dates', async () => {
      // TODO
    });
    it('should return success=false if the BalanceElectricoApi fails', async () => {
      // TODO
    });
    it('should return success=false if the BalanceElectricoApi returns no data', async () => {
      // TODO
    });
    it('should delete the data from dates if replace is true', async () => {
      // TODO
    });
    it('should not delete the data from dates if replace is false', async () => {
      // TODO
    });
    it('should save the data to the database', async () => {
      // TODO
    });
    it('should return success=false if db fails', async () => {
      // TODO
    });
    it('should return success=true if data is saved successfully', async () => {
      // TODO
    });
    // TODO test and handle the case when persistencs is partially failed
  });
});
