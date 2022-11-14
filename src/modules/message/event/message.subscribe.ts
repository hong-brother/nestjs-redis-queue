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

  @OnQueueFailed()
  failedMessage(job: Job) {
    this.logger.error(job.id);
  }

  @Process()
  async onActive(job: Job) {
    try {
      const message = job.data;
      return new Promise((resolve, reject) => {
        this.logger.log('releaseLock~');
        // job.releaseLock();
        this.redisQueue.pause(true);
        resolve(this.sleep(1000));
      })
        .then((value) => {
          this.redisQueue.add(job.id + '/' + message);
          return this.sleep(5000);
        })
        .finally(() => {
          this.logger.log(`take rock`);
          // job.takeLock();
          this.redisQueue.pause(false);
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

    this.logger.log('success message = ' + JSON.stringify(job.data));
  }
}
