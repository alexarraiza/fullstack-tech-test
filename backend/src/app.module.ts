import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { HealthModule } from './health/health.module';
import { MongodbTestingModule } from './mongodb-testing/mongodb-testing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DataIngestionModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        authSource: 'admin',
        auth: {
          username: configService.get<string>('MONGODB_USER'),
          password: configService.get<string>('MONGODB_PWD'),
        },
      }),
      inject: [ConfigService],
    }),
    MongodbTestingModule,
    HealthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
