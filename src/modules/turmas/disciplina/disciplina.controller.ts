import { Body, Controller } from '@nestjs/common';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { DisciplinaDTO } from './disciplina.dto';
import { DisciplinaService } from './disciplina.service';

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
}
