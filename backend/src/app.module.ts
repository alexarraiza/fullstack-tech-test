import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataConsumptionModule } from './data-consumption/data-consumption.module';
import { DataIngestionModule } from './data-ingestion/data-ingestion.module';
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
    HealthModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    DataConsumptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
