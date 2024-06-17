import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledBatchController } from './scheduled-batch.controller';
import { ScheduledBatchService } from './scheduled-batch.service';

describe('ScheduledBatchController', () => {
  let scheduledBatchController: ScheduledBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledBatchController],
      providers: [ScheduledBatchService],
    }).compile();

    scheduledBatchController = app.get<ScheduledBatchController>(ScheduledBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(scheduledBatchController.getHello()).toBe('Hello World!');
    });
  });
});
