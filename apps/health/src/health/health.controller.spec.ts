import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: { check: jest.fn() },
        },
        TypeOrmHealthIndicator,
        MemoryHealthIndicator,
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('checkV1', () => {
    it('should return health check result', async () => {
      // give
      const checkResDto: HealthCheckResult = {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
          memory_heap: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
          memory_heap: {
            status: 'up',
          },
        },
      };
      jest.spyOn(healthCheckService, 'check').mockResolvedValue(checkResDto);

      // when, then
      expect(await healthController.checkV1()).toEqual(checkResDto);
    });
  });
});
