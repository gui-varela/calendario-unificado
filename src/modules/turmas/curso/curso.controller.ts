import { Body, Controller, Query } from '@nestjs/common';
import {
  Delete,
  Get,
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { CursoDTO } from './curso.dto';
import { CursoService } from './curso.service';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) { }

  @Post()
  async create(@Body() data: CursoDTO) {
    return this.cursoService.create(data);
  }

  @Put()
  async update(@Body() data: CursoDTO) {
    return this.cursoService.update(data);
  }

  @Delete()
  async remove(@Body() data: CursoDTO) {
    return this.cursoService.remove(data);
  }

  @Get()
  async findCursoPorNome(@Query('nome') nome?: string,) {
    return this.cursoService.findCursoPorNome(nome);
  }
}
