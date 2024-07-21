import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT } from './constants';

import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('health')
  @HttpCode(200)
  @ApiOperation({ summary: 'Health check of the server' })
  @ApiResponse({ status: 200, description: 'Server is up and running' })
  async getHealthCheck() {
    return `[HEALTH CHECK] Up and running on ${this.configService.get<string>('SERVER_HOST') || DEFAULT_SERVER_HOST}:${this.configService.get<number>('SERVER_PORT') || DEFAULT_SERVER_PORT}`;
  }
}
