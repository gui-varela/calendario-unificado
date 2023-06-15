import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { CursoDTO } from './curso.dto';

@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) { }

  async create({ nome }: CursoDTO) {
    const cursoExists = await this.prisma.curso.findUnique({
      where: {
        nome: nome,
      },
    });

    if (cursoExists) {
      throw new AppError('Curso já existe');
    }

    const curso = await this.prisma.curso.create({
      data: {
        nome,
      },
    });

    return curso;
  }

  async update({ id, nome }: CursoDTO) {
    const cursoExists = await this.prisma.curso.findUnique({
      where: {
        id: id,
      },
    });

    if (!cursoExists) {
      throw new AppError('Curso não existe');
    }

    if (cursoExists.nome === nome) {
      throw new AppError('Curso já cadastrado');
    }

    const curso = await this.prisma.curso.update({
      where: {
        id: id,
      },
      data: {
        nome: nome,
      },
    });

    return curso;
  }

  async remove({ nome }: CursoDTO) {
    const cursoExists = await this.prisma.curso.findUnique({
      where: {
        nome: nome,
      },
    });

    if (!cursoExists) {
      throw new AppError('Curso não existe');
    }

    const curso = await this.prisma.curso.delete({
      where: {
        nome: nome,
      },
    });

    return curso;
  }
}
