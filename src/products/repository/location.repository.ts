import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../domain/location.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(Location)
    private readonly repository: Repository<Location>,
  ) {}

  async findById(id: string): Promise<Location> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Location[]> {
    return this.repository.find();
  }

  async findByName(name: string): Promise<Location[]> {
    return await this.repository.find({
      where: { name },
    });
  }
}
