import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MappingsService } from './mappings.service';
import { Mapping } from './schemas/mapping.schema';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('mappings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MappingsController {
  constructor(private readonly mappingsService: MappingsService) {}

  @Get()
  @Roles('user', 'reviewer', 'admin')
  findAll(): Promise<Mapping[]> {
    return this.mappingsService.findAll();
  }

  @Get(':condition')
  @Roles('user', 'reviewer', 'admin')
  findByCondition(@Param('condition') condition: string): Promise<Mapping> {
    return this.mappingsService.findByCondition(condition);
  }

  @Post()
  @Roles('admin')
  create(@Body() mapping: Partial<Mapping>): Promise<Mapping> {
    return this.mappingsService.create(mapping);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() update: Partial<Mapping>): Promise<Mapping> {
    return this.mappingsService.update(id, update);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string): Promise<void> {
    return this.mappingsService.delete(id);
  }
}