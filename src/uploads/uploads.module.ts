/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadsController } from './uploads.controller';
/*1. scope:global, appmodule에서 isgolobal 설정하면 import하지 않아도 된다
  2. scope:uploadsModule, 아래처럼 하면 스코프 변경됨  

  @Module({
    imports: [ConfigModule],
    controllers: [UploadsController],
    providers: [ConfigService],
  })
  export class UploadsModule {}

*/
@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
