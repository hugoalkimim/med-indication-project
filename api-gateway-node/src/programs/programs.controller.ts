
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { Program } from './schemas/program.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @Roles('user', 'reviewer', 'admin')
  findAll(): Promise<Program[]> {
    return this.programsService.findAll();
  }
  
  @Get('search')
  @Roles('user', 'reviewer', 'admin')
  search(@Query() query: any) {
    return this.programsService.search(query);
  }

  @Get(':id')
  @Roles('user', 'reviewer', 'admin')
  findById(@Param('id') id: string): Promise<Program> {
    return this.programsService.findById(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() data: Partial<Program>): Promise<Program> {
    return this.programsService.create(data);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() update: Partial<Program>): Promise<Program> {
    return this.programsService.update(id, update);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string): Promise<void> {
    return this.programsService.delete(id);
  }
}
