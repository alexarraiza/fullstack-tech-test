import { Test, TestingModule } from '@nestjs/testing';
import { MongodbTestingController } from './mongodb-testing.controller';

describe('MongodbTestingController', () => {
  let controller: MongodbTestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MongodbTestingController],
    }).compile();

    controller = module.get<MongodbTestingController>(MongodbTestingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
