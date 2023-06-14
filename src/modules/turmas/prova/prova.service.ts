import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { ProvaDTO } from './prova.dto';

@Injectable()
export class ProvaService {
  constructor(private prisma: PrismaService) {}

  async create({ nome, data, disciplinaId }: ProvaDTO) {

  }
}
