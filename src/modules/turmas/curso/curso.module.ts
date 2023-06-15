import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { PrismaService } from '../../../database/PrismaService';
import { EnsureAuthenticated } from 'src/middlewares/ensureAuthenticated.middleware';

@Module({
  controllers: [CursoController],
  providers: [CursoService, PrismaService],
})
export class CursoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .forRoutes({ path: 'curso', method: RequestMethod.ALL });
  }
}