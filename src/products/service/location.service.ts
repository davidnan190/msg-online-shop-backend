import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Location } from '../domain/location.entity';
import { ROMANIA_LOCATIONS_API_JSON } from '../config/location.config';
import { RawLocation } from '../dto/location/raw-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Location[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<RawLocation[]>(ROMANIA_LOCATIONS_API_JSON).pipe(
          catchError((error) => {
            throw new InternalServerErrorException(
              'Something went wrong with fetching the available locations.' +
                error,
            );
          }),
        ),
      );

      return response.data.map((item: RawLocation) =>
        this.mapToLocationEntity(item),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch locations.' + error,
      );
    }
  }

  private mapToLocationEntity(item: RawLocation): Location {
    const location = new Location();
    location.id = item.id;
    location.name = item.nume;
    location.country = 'Romania';
    location.city = item.nume;
    location.county = item.judet;
    return location;
  }
}
