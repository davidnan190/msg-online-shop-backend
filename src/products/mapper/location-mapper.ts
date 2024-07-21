import { Location } from '../domain/location.entity';
import { LocationDto } from '../dto/location/location.dto';

export class LocationMapper {
  static toDto(entity: Location): LocationDto {
    const { id, name, country, city, county, streetAddress } = entity;
    return { id, name, country, city, county, streetAddress };
  }
}
