import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MappingsService } from './mappings.service';
import { MappingsController } from './mappings.controller';
import { Mapping, MappingSchema } from './schemas/mapping.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mapping.name, schema: MappingSchema }]),
    HttpModule,
  ],
  controllers: [MappingsController],
  providers: [MappingsService],
})
export class MappingsModule {}
