import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { ProvaDTO } from './prova.dto';

@Injectable()
export class ProvaService {
  constructor(private prisma: PrismaService) {}

  async create({ nome, data, disciplinaId }: ProvaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const existeProva = await this.prisma.prova.findFirst({
      where: {
        disciplinaId: disciplinaId,
        nome: nome,
      },
    });

    if (existeProva) {
      throw new AppError('Essa prova já foi marcada');
    }

    const prova = await this.prisma.prova.create({
      data: {
        nome,
        data,
        disciplinaId,
      },
    });

    return prova;
  }

  async update({ nome, data, disciplinaId }: ProvaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const provaMarcada = await this.prisma.prova.findFirst({
      where: {
        disciplinaId: disciplinaId,
        nome: nome,
      },
    });

    if (!provaMarcada) {
      throw new AppError('Essa prova não existe');
    }

    const prova = await this.prisma.prova.update({
      where: {
        id: provaMarcada.id,
      },
      data: {
        nome,
        data,
        disciplinaId,
      },
    });

    return prova;
  }

  async remove({ nome, disciplinaId }: ProvaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const provaMarcada = await this.prisma.prova.findFirst({
      where: {
        disciplinaId: disciplinaId,
        nome: nome,
      },
    });

    if (!provaMarcada) {
      throw new AppError('Essa prova não existe');
    }

    const prova = await this.prisma.prova.delete({
      where: {
        id: provaMarcada.id,
      },
    });

    return prova;
  }
}
