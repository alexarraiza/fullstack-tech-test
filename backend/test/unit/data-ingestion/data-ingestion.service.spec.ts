import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as dateFns from 'date-fns';
import { DataIngestionService } from '../../../src/data-ingestion/data-ingestion.service';
import { IngestionResponseDto } from '../../../src/data-ingestion/dto/ingestion-response.dto';
import { ReeBalanceElectricoResponseDto } from '../../../src/data-ingestion/dto/ree-balance-electrico-response.dto';
import { BalanceElectricoApi } from '../../../src/data-ingestion/repositories/balance-electrico.api';
import { BalanceElectricoModel } from '../../../src/models/db-models/balance-electrico.schema';
import { DataIngestionLogModel, DataIngestionLogType } from '../../../src/models/db-models/data-ingestion-log.schema';

const mockBalanceElectricoApi = {
  getDataDayByDay: jest.fn(),
};

const mockBalanceElectricoModel = {
  find: jest.fn(),
  deleteMany: jest.fn(),
  create: jest.fn(),
};

interface MockDataIngestionLogModel {
  constructor: jest.Mock;
  findOne: jest.Mock;
  sort: jest.Mock;
  create: jest.Mock;
}

const mockDataIngestionLogModel: MockDataIngestionLogModel = {
  constructor: jest.fn(),
  findOne: jest.fn(() => mockDataIngestionLogModel),
  sort: jest.fn(() => mockDataIngestionLogModel),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  // MARK: onModuleInit
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

  // MARK: getDataCron
  describe('getDataCron', () => {
    it('should get data from the last successful sync until yesterday', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(mockDataIngestionLogModel);

      mockDataIngestionLogModel.sort = jest.fn().mockReturnValueOnce({
        success: true,
        startDate: dateFns.sub(new Date(), { days: 30 }),
        endDate: dateFns.sub(new Date(), { days: 15 }),
        type: DataIngestionLogType.CRON,
        message: 'Data ingested',
      } as DataIngestionLogModel);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataCron();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(getDataByDatesSpy).toHaveBeenCalledWith(
        dateFns.format(dateFns.sub(new Date(), { days: 15 }), 'yyyy-MM-dd'),
        dateFns.format(dateFns.endOfYesterday(), 'yyyy-MM-dd'),
        true,
      );
    });
    it('should get data from the start of current month until yesterday if there is no last successful sync', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(mockDataIngestionLogModel);
      mockDataIngestionLogModel.sort = jest.fn().mockReturnValueOnce(null);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataCron();
      expect(mockDataIngestionLogModel.findOne).toHaveBeenCalled();
      expect(getDataByDatesSpy).toHaveBeenCalledWith(
        dateFns.format(dateFns.startOfMonth(new Date()), 'yyyy-MM-dd'),
        dateFns.format(dateFns.endOfYesterday(), 'yyyy-MM-dd'),
        true,
      );
    });
    it('should save a sync log if getting the data is successful', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(mockDataIngestionLogModel);
      mockDataIngestionLogModel.sort = jest.fn().mockReturnValueOnce({
        success: true,
        startDate: dateFns.sub(new Date(), { days: 30 }),
        endDate: dateFns.sub(new Date(), { days: 15 }),
        type: DataIngestionLogType.CRON,
        message: 'Data ingested',
      } as DataIngestionLogModel);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataCron();
      expect(mockDataIngestionLogModel.create).toHaveBeenCalledWith({
        startDate: dateFns.startOfDay(dateFns.sub(new Date(), { days: 15 })),
        endDate: dateFns.endOfYesterday(),
        type: DataIngestionLogType.CRON,
        success: true,
        message: 'Data successfully ingested',
      });
    });
    it('should save a sync log if getting the data fails', async () => {
      mockDataIngestionLogModel.findOne = jest.fn().mockReturnValueOnce(mockDataIngestionLogModel);
      mockDataIngestionLogModel.sort = jest.fn().mockReturnValueOnce({
        success: true,
        startDate: dateFns.sub(new Date(), { days: 30 }),
        endDate: dateFns.sub(new Date(), { days: 15 }),
        type: DataIngestionLogType.CRON,
        message: 'Data ingested',
      } as DataIngestionLogModel);

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: false,
        message: 'Error',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataCron();
      expect(mockDataIngestionLogModel.create).toHaveBeenCalledWith({
        startDate: dateFns.startOfDay(dateFns.sub(new Date(), { days: 15 })),
        endDate: dateFns.endOfYesterday(),
        type: DataIngestionLogType.CRON,
        success: false,
        message: 'Error',
      });
    });
  });

  // MARK: getDataManually
  describe('getDataManually', () => {
    it('should call getDataByDates with the provided dates', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataManually(startDate, endDate, replace);
      expect(getDataByDatesSpy).toHaveBeenCalledWith(startDate, endDate, replace);
    });
    it('should call getDataByDates with replace set to false if not provided', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataManually(startDate, endDate);
      expect(getDataByDatesSpy).toHaveBeenCalledWith(startDate, endDate, false);
    });
    it('should call getDataByDates with replace set to whatever is provided', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataManually(startDate, endDate, replace);
      expect(getDataByDatesSpy).toHaveBeenCalledWith(startDate, endDate, replace);
    });
    it('should save a sync log if getting the data is successful', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: true,
        message: 'Data successfully ingested',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataManually(startDate, endDate, replace);
      expect(mockDataIngestionLogModel.create).toHaveBeenCalledWith({
        startDate: startDate,
        endDate: endDate,
        type: DataIngestionLogType.MANUAL,
        success: true,
        message: 'Data successfully ingested',
      });
    });
    it('should save a sync log if getting the data fails', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataByDatesSpy = jest.spyOn(service as any, 'getDataByDates');

      const getDataByDatesResult = {
        success: false,
        message: 'Error',
      } as IngestionResponseDto;

      getDataByDatesSpy.mockResolvedValueOnce(getDataByDatesResult);

      await service.getDataManually(startDate, endDate, replace);
      expect(mockDataIngestionLogModel.create).toHaveBeenCalledWith({
        startDate: startDate,
        endDate: endDate,
        type: DataIngestionLogType.MANUAL,
        success: false,
        message: 'Error',
      });
    });
  });

  // MARK: getDataByDates
  describe('getDataByDates', () => {
    it('should call the BalanceElectricoApi with the provided dates', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce(reeBalanceElectricoResponseDtoMock);

      mockBalanceElectricoModel.create = jest.fn().mockResolvedValueOnce({
        date: new Date(),
        type: 'type-1',
        group: 'group-1',
        value: 100,
      });

      await (service as any).getDataByDates(startDate, endDate, replace);

      expect(getDataDayByDaySpy).toHaveBeenCalledWith({
        startDate: dateFns.startOfDay(Date.parse(startDate)),
        endDate: dateFns.endOfDay(Date.parse(endDate)),
      });
    });
    it('should return success=false if the BalanceElectricoApi fails', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockRejectedValueOnce(new Error('API error'));

      const result = await (service as any).getDataByDates(startDate, endDate, replace);

      expect(result).toEqual({
        success: false,
        message: 'Error fetching data from API',
        error: 'Error: API error',
      });
    });
    it('should return success=false if the BalanceElectricoApi returns no data', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce({} as ReeBalanceElectricoResponseDto);

      const result = await (service as any).getDataByDates(startDate, endDate, replace);

      expect(result).toEqual({
        success: false,
        message: 'No data found in API response',
        error: 'No data found in API response',
      });
    });
    it('should delete the data from dates if replace is true', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce(reeBalanceElectricoResponseDtoMock);

      mockBalanceElectricoModel.deleteMany = jest.fn().mockResolvedValueOnce({});

      mockBalanceElectricoModel.create = jest.fn().mockResolvedValueOnce({
        date: new Date(),
        type: 'type-1',
        group: 'group-1',
        value: 100,
      });

      await (service as any).getDataByDates(startDate, endDate, replace);

      expect(mockBalanceElectricoModel.deleteMany).toHaveBeenCalledWith({
        date: {
          $gte: new Date(
            reeBalanceElectricoResponseDtoMock.included![0].attributes.content[0].attributes.values[0].datetime,
          ),
          $lte: new Date(
            reeBalanceElectricoResponseDtoMock.included![0].attributes.content[0].attributes.values[0].datetime,
          ),
        },
      });
    });
    it('should not delete the data from dates if replace is false', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = false;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce(reeBalanceElectricoResponseDtoMock);

      mockBalanceElectricoModel.deleteMany = jest.fn().mockResolvedValueOnce({});

      mockBalanceElectricoModel.create = jest.fn().mockResolvedValueOnce({
        date: new Date(),
        type: 'type-1',
        group: 'group-1',
        value: 100,
      });

      await (service as any).getDataByDates(startDate, endDate, replace);

      expect(mockBalanceElectricoModel.deleteMany).not.toHaveBeenCalled();
    });
    it('should save the data to the database', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce(reeBalanceElectricoResponseDtoMock);

      mockBalanceElectricoModel.create = jest.fn().mockResolvedValueOnce({});

      await (service as any).getDataByDates(startDate, endDate, replace);

      expect(mockBalanceElectricoModel.create).toHaveBeenCalledWith(
        [
          {
            date: new Date(
              reeBalanceElectricoResponseDtoMock.included![0].attributes.content[0].attributes.values[0].datetime,
            ),
            type: reeBalanceElectricoResponseDtoMock.included![0].attributes.content[0].type,
            group: reeBalanceElectricoResponseDtoMock.included![0].attributes.content[0].groupId,
            value: reeBalanceElectricoResponseDtoMock.included![0].attributes.content[0].attributes.values[0].value,
          },
        ],
        { aggregateErrors: true },
      );
    });
    it('should return success=false if db fails', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce(reeBalanceElectricoResponseDtoMock);

      mockBalanceElectricoModel.create = jest.fn().mockRejectedValueOnce(new Error('DB error'));

      const result = await (service as any).getDataByDates(startDate, endDate, replace);

      expect(result).toEqual({
        success: false,
        message: 'Error persisting data',
        error: 'Error: DB error',
      });
    });
    it('should return success=true if data is saved successfully', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-31';
      const replace = true;

      const getDataDayByDaySpy = jest.spyOn(mockBalanceElectricoApi, 'getDataDayByDay');
      getDataDayByDaySpy.mockResolvedValueOnce(reeBalanceElectricoResponseDtoMock);

      mockBalanceElectricoModel.create = jest.fn().mockResolvedValueOnce({});

      const result = await (service as any).getDataByDates(startDate, endDate, replace);

      expect(result).toEqual({
        success: true,
        message: 'Data ingested successfully',
      });
    });
  });
});

const reeBalanceElectricoResponseDtoMock: ReeBalanceElectricoResponseDto = {
  data: {
    type: 'balance-electrico',
    id: '1',
    attributes: {
      title: 'Balance Electrico',
      'last-update': '2023-01-01T00:00:00Z',
      description: 'Description of the balance electrico',
    },
    meta: {
      'cache-control': {
        cache: 'max-age=3600',
        expireAt: '2023-01-01T01:00:00Z',
      },
    },
  },
  included: [
    {
      type: 'included-type',
      id: '1',
      attributes: {
        title: 'Title',
        'last-update': '2023-01-01T00:00:00Z',
        description: 'Description of the included item',
        magnitude: {},
        content: [
          {
            type: 'type-1',
            id: '1',
            groupId: 'group-1',
            attributes: {
              title: 'Content Title',
              description: 'Description of the content item',
              color: '#FFFFFF',
              icon: null,
              type: 'type-1',
              magnitude: {},
              composite: true,
              'last-update': '2023-01-01T00:00:00Z',
              values: [
                {
                  value: 100,
                  percentage: 50,
                  datetime: '2023-01-01T00:00:00Z',
                },
              ],
              total: 100,
              'total-percentage': 50,
            },
          },
        ],
      },
    },
  ],
};
