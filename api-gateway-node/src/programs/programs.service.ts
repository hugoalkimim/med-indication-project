import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program } from './schemas/program.schema';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>, private readonly httpService: HttpService
  ) {}

  async findAll(): Promise<Program[]> {
    return this.programModel.find().exec();
  }

  async findById(id: string): Promise<Program> {
    const program = await this.programModel.findById(id).exec();
    if (!program)
      throw new NotFoundException(`Program with id ${id} not found`);
    return program;
  }

  async search(query: any): Promise<Program[]> {
    const mongoQuery = {};

    if (query.name) mongoQuery['program_name'] = query.name;
    if (query.coverage_eligibility)
      mongoQuery['coverage_eligibilities'] = query.coverage_eligibility;
    if (query.type) mongoQuery['program_type'] = query.type;
    if (query.requires) mongoQuery['requirements.name'] = query.requires;

    return this.programModel.find(mongoQuery).exec();
  }

  async create(data: Partial<Program>): Promise<Program> {
    return this.programModel.create(data);
  }

  async update(id: string, update: Partial<Program>): Promise<Program> {
    const updated = await this.programModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Program with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.programModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Program with id ${id} not found`);
  }

  
  async parseProgram(raw: any) {
    const url = 'http://med-service-py:8000/parse';
    const response = await lastValueFrom(this.httpService.post(url, raw));
    return response.data;
  }

}
