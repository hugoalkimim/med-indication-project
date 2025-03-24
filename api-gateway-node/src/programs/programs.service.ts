import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program } from './schemas/program.schema';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>,
  ) {}

  async findAll(): Promise<Program[]> {
    return this.programModel.find().exec();
  }

  async findById(id: string): Promise<Program> {
    const program = await this.programModel.findById(id).exec();
    if (!program) throw new NotFoundException(`Program with id ${id} not found`);
    return program;
  }

  async create(data: Partial<Program>): Promise<Program> {
    return this.programModel.create(data);
  }

  async update(id: string, update: Partial<Program>): Promise<Program> {
    const updated = await this.programModel.findByIdAndUpdate(id, update, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Program with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.programModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Program with id ${id} not found`);
  }
}