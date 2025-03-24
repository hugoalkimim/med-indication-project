import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MappingsService } from './mappings.service';
import { Mapping } from './schemas/mapping.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('mappings')
export class MappingsController {
  constructor(private readonly mappingsService: MappingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(): Promise<Mapping[]> {
    return this.mappingsService.findAll();
  }

  @Get(':condition')
  @UseGuards(AuthGuard('jwt'))
  findByCondition(@Param('condition') condition: string): Promise<Mapping> {
    return this.mappingsService.findByCondition(condition);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() mapping: Partial<Mapping>): Promise<Mapping> {
    return this.mappingsService.create(mapping);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() update: Partial<Mapping>): Promise<Mapping> {
    return this.mappingsService.update(id, update);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string): Promise<void> {
    return this.mappingsService.delete(id);
  }
}