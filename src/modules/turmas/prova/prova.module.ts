import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProvaService } from './prova.service';
import { ProvaController } from './prova.controller';
import { PrismaService } from '../../../database/PrismaService';

@Module({
  controllers: [ProvaController],
  providers: [ProvaService, PrismaService],
})
export class ProvaModule {
}
