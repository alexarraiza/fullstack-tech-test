import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbTestingController } from './mongodb-testing.controller';
import { Test, TestSchema } from './schemas/test.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [MongodbTestingController],
})
export class MongodbTestingModule {}
