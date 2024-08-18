import { ROUTES } from '@constants/routes.constant';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@ApiTags(ROUTES.COMMON.TAG)
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      ...(this.configService.get('MONGODB_URI')
        ? [() => this.db.pingCheck('database')]
        : []),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.95,
        }),
    ]);
  }
}
