import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mapping } from './schemas/mapping.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MappingsService {
  constructor(
    @InjectModel(Mapping.name) private mappingModel: Model<Mapping>,
    private readonly httpService: HttpService,
  ) {}

  async findAll(): Promise<Mapping[]> {
    return this.mappingModel.find().exec();
  }

  async findByCondition(condition: string): Promise<Mapping> {
    const result = await this.mappingModel.findOne({ condition }).exec();
    if (!result)
      throw new NotFoundException(`Mapping for ${condition} not found`);
    return result;
  }

  async create(mapping: Partial<Mapping>): Promise<Mapping> {
    return new this.mappingModel(mapping).save();
  }

  async update(id: string, update: Partial<Mapping>): Promise<Mapping> {
    const updated = await this.mappingModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Mapping with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.mappingModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Mapping with id ${id} not found`);
  }

  async mapConditions(conditions: string[]) {
    const url = 'http://med-service-py:8000/map';
    const response = await lastValueFrom(
      this.httpService.post(url, { conditions }),
    );
    return response.data.mappings;
  }
  
  async extractIndications(medName: string) {
    const url = `http://med-service-py:8000/indications/${medName}`;
    const response = await lastValueFrom(this.httpService.get(url));
    return response.data.indications;
  }

}
