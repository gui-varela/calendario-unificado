import { Body, Controller, Query } from '@nestjs/common';
import {
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';

import { DisciplinaDTO } from './disciplina.dto';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaAlunoDTO } from './disciplina-aluno.dto';

@Controller('disciplina')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @Post()
  async create(@Body() data: DisciplinaDTO) {
    return this.disciplinaService.create(data);
  }

  @Put()
  async update(@Body() data: DisciplinaDTO) {
    return this.disciplinaService.update(data);
  }

  @Delete()
  async remove(@Body() data: DisciplinaDTO) {
    return this.disciplinaService.remove(data);
  }

  @Get()
  async findDisciplinasPorUsuario(@Query('username') username: string) {
    return this.disciplinaService.findDisciplinasPorUsuario(username);
  }

  @Post('/aluno')
  async addDisciplinaAoAluno(@Body() data: DisciplinaAlunoDTO) {
    return this.disciplinaService.addDisciplinaAoAluno(data);
  }

  @Delete('/aluno')
  async removeDisciplinaDoAluno(@Body() data: DisciplinaAlunoDTO) {
    return this.disciplinaService.removeDisciplinaDoAluno(data);
  }
}
