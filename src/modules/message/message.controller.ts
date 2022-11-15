import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
      },
    },
  })
  publishMessage(@Body('userId') userId: string) {
    this.messageService.sendMessage(userId);
  }
}
