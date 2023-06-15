import { Controller, Param } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';

import { AlunoService } from './aluno.service';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Get(':id')
  async findByUsuarioId(@Param('id') usuarioId: string) {
    return this.alunoService.findAlunoPorUsuarioId(usuarioId);
  }
}
