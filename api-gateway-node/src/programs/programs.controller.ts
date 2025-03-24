import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { Program } from './schemas/program.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Controller('programs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @Roles('user', 'reviewer', 'admin')
  async findAll(): Promise<Program[]> {
    return this.programsService.findAll();
  }

  @Get('search')
  @Roles('user', 'reviewer', 'admin')
  async search(@Query() query: any): Promise<Program[]> {
    try {
      return await this.programsService.search(query);
    } catch (error) {
      throw new BadRequestException('Invalid search query');
    }
  }

  @Get(':id')
  @Roles('user', 'reviewer', 'admin')
  async findById(@Param('id') id: string): Promise<Program> {
    const program = await this.programsService.findById(id);
    if (!program) throw new NotFoundException(`Program with id ${id} not found`);
    return program;
  }

  @Post()
  @Roles('admin')
  async create(@Body() data: CreateProgramDto): Promise<Program> {
    try {
      return await this.programsService.create(data);
    } catch (error) {
      throw new BadRequestException('Failed to create program');
    }
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() update: UpdateProgramDto): Promise<Program> {
    try {
      return await this.programsService.update(id, update);
    } catch (error) {
      throw new NotFoundException(`Program with id ${id} not found`);
    }
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.programsService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Program with id ${id} not found`);
    }
  }

  @Post('parse')
  @Roles('admin')
  async parseProgram(@Body() raw: any) {
    try {
      await this.programsService.parseProgram(raw);
    } catch (error) {
      throw new BadRequestException('Failed to parse programs');
    }
  }
}