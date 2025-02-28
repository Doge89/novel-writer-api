import { Test, TestingModule } from '@nestjs/testing';
import { BaseValidatorService } from './base-validator.service';

describe('BaseValidatorService', () => {
  let service: BaseValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseValidatorService],
    }).compile();

    service = module.get<BaseValidatorService>(BaseValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
