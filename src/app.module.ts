import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/accounts/user/user.module';
import { SessionsModule } from './modules/accounts/sessions/sessions.module';
import { DisciplinaModule } from './modules/turmas/disciplina/disciplina.module';
import { ProvaModule } from './modules/turmas/prova/prova.module';

@Module({
  imports: [
    UserModule,
    SessionsModule,
    DisciplinaModule,
    ProvaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
