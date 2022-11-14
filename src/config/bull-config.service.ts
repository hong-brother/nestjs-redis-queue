import { Injectable } from '@nestjs/common';
import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { AppConfig } from './app.config';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private appConfig: AppConfig) {}
  createSharedConfiguration():
    | Promise<BullRootModuleOptions>
    | BullRootModuleOptions {
    return {
      redis: {
        host: this.appConfig.get('redis.host'),
        port: +this.appConfig.get('redis.port'),
      },
    };
  }
}
