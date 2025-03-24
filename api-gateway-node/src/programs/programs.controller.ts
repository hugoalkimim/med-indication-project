
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { Program } from './schemas/program.schema';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  findAll(): Promise<Program[]> {
    return this.programsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<Program> {
    return this.programsService.findById(id);
  }

  @Post()
  create(@Body() data: Partial<Program>): Promise<Program> {
    return this.programsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() update: Partial<Program>): Promise<Program> {
    return this.programsService.update(id, update);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.programsService.delete(id);
  }
}
