import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaController } from './disciplina.controller';
import { PrismaService } from '../../../database/PrismaService';
import { EnsureAuthenticated } from 'src/middlewares/ensureAuthenticated.middleware';

@Module({
  controllers: [DisciplinaController],
  providers: [DisciplinaService, PrismaService],
})
export class DisciplinaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .forRoutes({ path: 'disciplina', method: RequestMethod.ALL });
  }
}