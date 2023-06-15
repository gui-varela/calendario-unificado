import { Body, Controller } from '@nestjs/common';
import { Delete, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { ProvaDTO } from './prova.dto';
import { ProvaService } from './prova.service';

@Controller('prova')
export class ProvaController {
  constructor(private readonly provaService: ProvaService) {}

  @Post()
  async create(@Body() data: ProvaDTO) {
    return this.provaService.create(data);
  }

  @Put()
  async update(@Body() data: ProvaDTO) {
    return this.provaService.update(data);
  }

  @Delete()
  async remove(@Body() data: ProvaDTO) {
    return this.provaService.remove(data);
  }

}
