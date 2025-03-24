import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { getModelToken } from '@nestjs/mongoose';
import { Program } from './schemas/program.schema';
import { Model } from 'mongoose';

const mockProgram = {
  _id: '1',
  program_name: 'Sample Program',
  coverage_eligibilities: ['Commercial'],
  program_type: 'Coupon',
  requirements: [{ name: 'us_residency', value: 'true' }],
  benefits: [{ name: 'max_annual_savings', value: '13000' }],
  forms: [{ name: 'Enrollment Form', link: 'https://example.com' }],
  funding: { evergreen: 'true', current_funding_level: 'Unknown' },
  details: [{ eligibility: 'some', program: 'details' }],
};

const mockProgramModel = () => ({
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockProgram]) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProgram) }),
  findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProgram) }),
  findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProgram) }),
  create: jest.fn().mockResolvedValue(mockProgram),
});

describe('ProgramsService', () => {
  let service: ProgramsService;
  let model: Model<Program>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        {
          provide: getModelToken(Program.name),
          useFactory: mockProgramModel,
        },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
    model = module.get<Model<Program>>(getModelToken(Program.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all programs', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockProgram]);
  });

  it('should return a program by id', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockProgram);
  });

  it('should create a new program', async () => {
    const result = await service.create(mockProgram);
    expect(result).toEqual(mockProgram);
  });

  it('should update a program', async () => {
    const result = await service.update('1', { program_type: 'Grant' });
    expect(result).toEqual(mockProgram);
  });

  it('should delete a program', async () => {
    await expect(service.delete('1')).resolves.toBeUndefined();
  });
});