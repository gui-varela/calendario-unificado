import { Controller, Param } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';

import { ProfessorService } from './professor.service';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get(':id')
  async findByUsuarioId(@Param('id') usuarioId: string) {
    return this.professorService.findProfessorPorUsuarioId(usuarioId);
  }
}
