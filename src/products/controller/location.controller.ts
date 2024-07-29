import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  LOCATION_FEATURE_BASE_PATH,
  LOCATION_FEATURE_NAME,
} from '../config/location.config';

import { API_AUTH_TYPE } from 'src/constants';
import { LocationDto } from '../dto/location/location.dto';
import { LocationMapper } from '../mapper/location-mapper';
import { LocationService } from '../service/location.service';

@ApiTags(LOCATION_FEATURE_NAME)
@ApiBearerAuth(API_AUTH_TYPE)
@Controller(LOCATION_FEATURE_BASE_PATH)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all available locations' })
  @ApiResponse({
    status: 200,
    description: 'List of all available locations',
    type: [LocationDto],
  })
  async getAllLocations(): Promise<LocationDto[]> {
    const availableLocations = await this.locationService.getAll();
    return availableLocations.map((location) => LocationMapper.toDto(location));
  }

  @Get('available')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all available locations in Romania' })
  @ApiResponse({
    status: 200,
    description: 'List of all available locations in Romania',
    type: [LocationDto],
  })
  async getAvailableLocations(): Promise<LocationDto[]> {
    const availableLocations = await this.locationService.getAllFromRomania();
    return availableLocations.map((location) => LocationMapper.toDto(location));
  }

  
}
