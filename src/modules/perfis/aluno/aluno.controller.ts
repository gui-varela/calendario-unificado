import { Body, Controller, Param } from '@nestjs/common';
import { Delete, Get, Post } from '@nestjs/common/decorators/http/request-mapping.decorator';

import { AlunoService } from './aluno.service';
import { DisciplinaAlunoDTO } from './disciplina-aluno.dto';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) { }

  @Get(':id')
  async findByUsuarioId(@Param('id') usuarioId: string) {
    return this.alunoService.findAlunoPorUsuarioId(usuarioId);
  }

  @Post('/disciplina')
  async addDisciplinaAoAluno(@Body() data: DisciplinaAlunoDTO) {
    return this.alunoService.addDisciplinaAoAluno(data);
  }

  @Delete('/disciplina')
  async removeDisciplinaDoAluno(@Body() data: DisciplinaAlunoDTO) {
    return this.alunoService.removeDisciplinaDoAluno(data);
  }
}
