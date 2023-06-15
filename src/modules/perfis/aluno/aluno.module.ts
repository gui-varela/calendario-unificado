import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { AlunoController } from './aluno.controller';
import { PrismaService } from '../../../database/PrismaService';
import { EnsureAuthenticated } from 'src/middlewares/ensureAuthenticated.middleware';

@Module({
  controllers: [AlunoController],
  providers: [AlunoService, PrismaService],
})
export class AlunoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .forRoutes({ path: 'aluno', method: RequestMethod.ALL });
  }
}
