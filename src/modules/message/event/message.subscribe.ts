import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Processor('redis-queue')
export class MessageSubscribe {
  constructor(
    @InjectQueue('redis-queue')
    private redisQueue: Queue,
  ) {}

  private readonly logger = new Logger(MessageSubscribe.name);

  sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  @Process()
  async onActive(job: Job) {
    try {
      return new Promise((resolve, reject) => {
        this.logger.log('[1/2]Processing....');
        resolve(this.sleep(5000));
      })
        .catch((e) => {
          this.logger.error(`fail message = ${e.message}`);
          return job.remove();
        })
        .finally(() => {
          this.logger.log('finally and 후처리');
        });

      // void this.redisQueue.removeRepeatableByKey(String(job.id));
      // this.logger.log('job.finished');
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @OnQueueFailed()
  onFailed(job: Job) {
    // job.remove();
    this.logger.log('fail message =' + JSON.stringify(job.data));
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    // void job.remove();

    this.logger.log('메세지 성공 판단 삭제~');
  }
}
