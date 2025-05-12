import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
import { MongodbTestingModule } from './mongodb-testing/mongodb-testing.module';
import { HealthModule } from './health/health.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
