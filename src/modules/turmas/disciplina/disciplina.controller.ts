import { Body, Controller, Query } from '@nestjs/common';
import {
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';

import { DisciplinaDTO } from './disciplina.dto';
import { DisciplinaService } from './disciplina.service';

@Controller('disciplina')
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) { }

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

  @Get('/cursos')
  async findCursosDaDisciplina(@Body() data: DisciplinaDTO) {
    return this.disciplinaService.findCursosDaDisciplina(data);
  }

  @Get('/busca')
  async findDisciplinasPorNomeOuCodigo(
    @Query('nome') nome?: string,
    @Query('codigo') codigo?: string,
  ) {
    return this.disciplinaService.findDisciplinasPorNomeOuCodigo(nome, codigo);
  }

  @Get('/detalhes')
  async getDetalhesDisciplnha(
    @Query('codigo') codigo?: string,
  ) {
    return this.disciplinaService.getDetalhesDisciplnha(codigo);
  }
}
