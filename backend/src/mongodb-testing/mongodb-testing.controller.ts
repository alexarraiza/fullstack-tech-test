import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Test } from './schemas/test.schema';

@Controller('mongodb-testing')
export class MongodbTestingController {
  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post()
  async postTestData(@Body() testData: { name: string }): Promise<Test> {
    const createdTestData = new this.testModel(testData);
    return createdTestData.save();
  }

  @Get()
  async findAll(): Promise<Test[]> {
    return this.testModel.find().exec();
  }
}
