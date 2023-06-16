import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { CursoDTO } from './curso.dto';
import { CursoDisciplinaDTO } from './curso-disciplina.dto';

@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) {}

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

  async removeCursoDisciplina({ codigo, nomeCurso }: CursoDisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const cursoExists = await this.prisma.curso.findUnique({
      where: {
        nome: nomeCurso,
      },
    });

    if (!cursoExists) {
      throw new AppError('Curso não existe');
    }

    const disciplina = await this.prisma.disciplina.update({
      where: {
        codigo: codigo,
      },
      data: {
        Curso: {
          disconnect: {
            nome: nomeCurso,
          },
        },
      },
    });

    return disciplina;
  }

  async addCursoDisciplina({ codigo, nomeCurso }: CursoDisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const cursoExists = await this.prisma.curso.findUnique({
      where: {
        nome: nomeCurso,
      },
    });

    if (!cursoExists) {
      throw new AppError('Curso não existe');
    }

    const disciplina = await this.prisma.disciplina.update({
      where: {
        codigo: codigo,
      },
      data: {
        Curso: {
          connect: {
            nome: nomeCurso,
          },
        },
      },
    });

    return disciplina;
  }

  async findCursoPorNome(nome?: string) {
    const cursos = await this.prisma.curso.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    if (cursos.length === 0) {
      throw new AppError('Nenhum curso encontrado');
    }

    return cursos;
  }
}
