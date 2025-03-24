import { Test, TestingModule } from '@nestjs/testing';
import { MappingsService } from './mappings.service';
import { getModelToken } from '@nestjs/mongoose';
import { Mapping } from './schemas/mapping.schema';
import { NotFoundException } from '@nestjs/common';

describe('MappingsService', () => {
  let service: MappingsService;
  let mappingModel: any;

  const mockMapping = {
    _id: 'mockId',
    condition: 'Hypertension',
    icd10: 'I10',
    description: 'Essential (primary) hypertension',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const modelMock = {
      find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockMapping]) }),
      findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MappingsService,
        {
          provide: getModelToken(Mapping.name),
          useValue: {
            ...modelMock,
            new: jest.fn().mockResolvedValue(mockMapping),
            constructor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MappingsService>(MappingsService);
    mappingModel = module.get(getModelToken(Mapping.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all mappings', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMapping]);
      expect(mappingModel.find).toHaveBeenCalled();
    });
  });

  describe('findByCondition', () => {
    it('should return a mapping by condition', async () => {
      mappingModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockMapping),
      });

      const result = await service.findByCondition('Hypertension');
      expect(result).toEqual(mockMapping);
      expect(mappingModel.findOne).toHaveBeenCalledWith({ condition: 'Hypertension' });
    });

    it('should throw NotFoundException if not found', async () => {
      mappingModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findByCondition('Invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a mapping', async () => {
      const saveMock = jest.fn().mockResolvedValueOnce(mockMapping);
      const createMock = jest.fn().mockImplementation(() => ({ save: saveMock }));

      service = new MappingsService(createMock as any);

      const result = await service.create(mockMapping);
      expect(result).toEqual(mockMapping);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the updated mapping', async () => {
      mappingModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockMapping),
      });

      const result = await service.update('mockId', mockMapping);
      expect(result).toEqual(mockMapping);
    });

    it('should throw NotFoundException if not found', async () => {
      mappingModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.update('invalidId', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a mapping', async () => {
      mappingModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockMapping),
      });

      await expect(service.delete('mockId')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if not found', async () => {
      mappingModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.delete('invalidId')).rejects.toThrow(NotFoundException);
    });
  });
});
