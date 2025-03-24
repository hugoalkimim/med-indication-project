import { IsString } from 'class-validator';

export class CreateMappingDto {
  @IsString()
  condition: string;

  @IsString()
  icd10: string;

  @IsString()
  description: string;
}