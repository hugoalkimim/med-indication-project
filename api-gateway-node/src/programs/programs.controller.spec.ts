import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { Program } from './schemas/program.schema';

const mockProgram: Program = {
  _id: '1',
  program_name: 'Sample Program',
  coverage_eligibilities: ['Commercial'],
  program_type: 'Coupon',
  requirements: [{ name: 'us_residency', value: 'true' }],
  benefits: [{ name: 'max_annual_savings', value: '13000' }],
  forms: [{ name: 'Enrollment Form', link: 'https://example.com' }],
  funding: { evergreen: 'true', current_funding_level: 'Unknown' },
  details: [{ eligibility: 'some', program: 'details' }],
} as any;

describe('ProgramsController', () => {
  let controller: ProgramsController;
  let service: ProgramsService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockProgram]),
    findById: jest.fn().mockResolvedValue(mockProgram),
    create: jest.fn().mockResolvedValue(mockProgram),
    update: jest.fn().mockResolvedValue(mockProgram),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
      providers: [
        { provide: ProgramsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ProgramsController>(ProgramsController);
    service = module.get<ProgramsService>(ProgramsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all programs', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockProgram]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a program by id', async () => {
    const result = await controller.findById('1');
    expect(result).toEqual(mockProgram);
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('should create a new program', async () => {
    const result = await controller.create(mockProgram);
    expect(result).toEqual(mockProgram);
    expect(service.create).toHaveBeenCalledWith(mockProgram);
  });

  it('should update a program', async () => {
    const result = await controller.update('1', { program_type: 'Grant' });
    expect(result).toEqual(mockProgram);
    expect(service.update).toHaveBeenCalledWith('1', { program_type: 'Grant' });
  });

  it('should delete a program', async () => {
    const result = await controller.delete('1');
    expect(result).toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith('1');
  });
});
