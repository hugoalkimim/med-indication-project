import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Requirement {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

class Benefit {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

class Form {
  @IsString()
  name: string;

  @IsString()
  link: string;
}

class Funding {
  @IsOptional()
  @IsString()
  evergreen?: string;

  @IsOptional()
  @IsString()
  current_funding_level?: string;
}

class Detail {
  @IsOptional()
  @IsString()
  eligibility?: string;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  renewal?: string;

  @IsOptional()
  @IsString()
  income?: string;
}

export class CreateProgramDto {
  @IsString()
  program_name: string;

  @IsArray()
  @IsString({ each: true })
  coverage_eligibilities: string[];

  @IsString()
  program_type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Requirement)
  requirements: Requirement[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Benefit)
  benefits: Benefit[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Form)
  forms: Form[];

  @ValidateNested()
  @Type(() => Funding)
  @IsOptional()
  funding?: Funding;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Detail)
  details: Detail[];
}
