import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { MappingsService } from './mappings.service';
import { Mapping } from './schemas/mapping.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateMappingDto } from './dto/create-mapping.dto';
import { UpdateMappingDto } from './dto/update-mapping.dto';

@Controller('mappings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MappingsController {
  constructor(private readonly mappingsService: MappingsService) {}

  @Get()
  @Roles('user', 'reviewer', 'admin')
  async findAll(): Promise<Mapping[]> {
    return this.mappingsService.findAll();
  }

  @Get(':condition')
  @Roles('user', 'reviewer', 'admin')
  async findByCondition(@Param('condition') condition: string): Promise<Mapping> {
    const mapping = await this.mappingsService.findByCondition(condition);
    if (!mapping) throw new NotFoundException(`Mapping with condition '${condition}' not found`);
    return mapping;
  }

  @Post()
  @Roles('admin')
  async create(@Body() mapping: CreateMappingDto): Promise<Mapping> {
    try {
      return await this.mappingsService.create(mapping);
    } catch (error) {
      throw new BadRequestException('Failed to create mapping');
    }
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() update: UpdateMappingDto): Promise<Mapping> {
    try {
      return await this.mappingsService.update(id, update);
    } catch (error) {
      throw new NotFoundException(`Mapping with id '${id}' not found`);
    }
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.mappingsService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Mapping with id '${id}' not found`);
    }
  }

  @Get('indications/:med_name')
  async getIndications(@Param('med_name') medName: string) {
    console.log('medName:', medName);
    return this.mappingsService.extractIndications(medName);
  }
}