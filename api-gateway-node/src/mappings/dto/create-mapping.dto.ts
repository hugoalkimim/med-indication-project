import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IndicationDto {
  @IsString()
  condition: string;

  @IsString()
  icd10: string;
}

export class CreateMappingDto {
  @IsString()
  medication: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndicationDto)
  indications: IndicationDto[];
}