import { Body, Controller, Delete, Post } from '@nestjs/common';
import { SessionDTO } from '../user/session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() data: SessionDTO) {
    return this.sessionsService.create(data);
  }

  @Delete()
  logout(@Body() data: SessionDTO) {
    return this.sessionsService.logout(data);
  }
}
