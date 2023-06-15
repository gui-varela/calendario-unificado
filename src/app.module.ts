import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/accounts/user/user.module';
import { SessionsModule } from './modules/accounts/sessions/sessions.module';
import { DisciplinaModule } from './modules/turmas/disciplina/disciplina.module';
import { ProvaModule } from './modules/turmas/prova/prova.module';
import { AlunoModule } from './modules/perfis/aluno/aluno.module';

@Module({
  imports: [
    UserModule,
    SessionsModule,
    DisciplinaModule,
    ProvaModule,
    AlunoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
