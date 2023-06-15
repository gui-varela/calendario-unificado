import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { ProvaDTO } from './prova.dto';
import { ProvaService } from './prova.service';

@Controller('prova')
export class ProvaController {
  constructor(private readonly provaService: ProvaService) {}

  @Post()
  async create(@Body() data: ProvaDTO) {
    return this.provaService.create(data);
  }
}
