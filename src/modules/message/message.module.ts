import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { BullModule } from '@nestjs/bull';
import { MessageSubscribe } from './event/message.subscribe';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'redis-queue',
      defaultJobOptions: {
        removeOnFail: true,
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageSubscribe],
})
export class MessageModule {}
