import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessageService {
  private logger = new Logger(MessageService.name);
  // https://overcome-the-limits.tistory.com/679?category=1006727

  constructor(
    @InjectQueue('redis-queue')
    private redisQueue: Queue,
  ) {}

  sendMessage(message) {
    try {
      // 추후 enum으로 변경 예정
      void this.redisQueue.add({ message }, {});
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
