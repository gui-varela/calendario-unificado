import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/accounts/user/user.module';
import { SessionsModule } from './modules/accounts/sessions/sessions.module';

@Module({
  imports: [
    UserModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
