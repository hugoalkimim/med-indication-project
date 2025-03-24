import { Test, TestingModule } from '@nestjs/testing';
import { MappingsController } from './mappings.controller';
import { MappingsService } from './mappings.service';
import { Mapping } from './schemas/mapping.schema';
import { NotFoundException } from '@nestjs/common';

describe('MappingsController', () => {
  let controller: MappingsController;
  let service: MappingsService;

  const mockMapping = {
    medication: 'Metformin',
    indications: [
      {
        condition: 'Diabetes',
        icd10: 'E11',
        description: 'Type 2 diabetes mellitus',
      },
    ],
  };

  const serviceMock = {
    findAll: jest.fn().mockResolvedValue([mockMapping]),
    findByCondition: jest.fn().mockResolvedValue(mockMapping),
    create: jest.fn().mockResolvedValue(mockMapping),
    update: jest.fn().mockResolvedValue(mockMapping),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MappingsController],
      providers: [{ provide: MappingsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<MappingsController>(MappingsController);
    service = module.get<MappingsService>(MappingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of mappings', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockMapping]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCondition', () => {
    it('should return a mapping by condition', async () => {
      const result = await controller.findByCondition('Diabetes');
      expect(result).toEqual(mockMapping);
      expect(service.findByCondition).toHaveBeenCalledWith('Diabetes');
    });

    it('should throw error if condition is not found', async () => {
      jest
        .spyOn(service, 'findByCondition')
        .mockRejectedValueOnce(new NotFoundException('Mapping not found'));

      await expect(controller.findByCondition('Invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new mapping', async () => {
      const result = await controller.create(mockMapping);
      expect(result).toEqual(mockMapping);
      expect(service.create).toHaveBeenCalledWith(mockMapping);
    });
  });

  describe('update', () => {
    it('should update a mapping', async () => {
      const result = await controller.update('medication', {
        medication: 'test',
        indications: mockMapping.indications,
      });
      expect(result).toEqual(mockMapping);
      expect(service.update).toHaveBeenCalledWith('medication', {
        medication: 'test',
        indications: mockMapping.indications,
      });
    });
  });

  describe('delete', () => {
    it('should delete a mapping', async () => {
      await controller.delete('mockId');
      expect(service.delete).toHaveBeenCalledWith('mockId');
    });
  });
});
