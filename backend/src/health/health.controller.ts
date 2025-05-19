import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongooseIndicator: MongooseHealthIndicator,
  ) {}

  @HealthCheck()
  @Get()
  async healthCheck() {
    return this.health.check([() => this.mongooseIndicator.pingCheck('mongodb')]);
  }
}
