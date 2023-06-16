import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProvaService } from './prova.service';
import { ProvaController } from './prova.controller';
import { PrismaService } from '../../../database/PrismaService';
import { EnsureAuthenticated } from 'src/middlewares/ensureAuthenticated.middleware';
import { DisciplinaService } from '../disciplina/disciplina.service';

@Module({
  controllers: [ProvaController],
  providers: [ProvaService, PrismaService, DisciplinaService],
})
export class ProvaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .forRoutes({ path: 'prova', method: RequestMethod.ALL });
  }
}
