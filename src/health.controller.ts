import { Controller, Get } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { DEFAULT_SERVER_PORT } from './constants';

@Controller()
export class HealthController {
  constructor(private readonly configService: ConfigService) {}
  @Get('health')
  async getHealthCheck() {
    return `[INFO] Up and running on port ${this.configService.get<number>('SERVER_PORT') || DEFAULT_SERVER_PORT}`;
  }
}
