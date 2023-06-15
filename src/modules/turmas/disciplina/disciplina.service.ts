import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { DisciplinaDTO } from './disciplina.dto';

@Injectable()
export class DisciplinaService {
  constructor(private prisma: PrismaService) { }

  async create({ nome, codigo, usuarioCriadorId }: DisciplinaDTO) {
    const disciplinaAlreadyExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo
      }
    });

    if (disciplinaAlreadyExists) {
      throw new AppError('Disciplina já existe');
    }

    const existeProfessor = await this.prisma.usuario.findUnique({
      where: {
        id: usuarioCriadorId
      }
    });

    if (!existeProfessor) {
      throw new AppError('Não existe professor');
    }

    const disciplina = await this.prisma.disciplina.create({
      data: {
        nome,
        codigo,
        usuarioCriadorId
      }
    });

    return disciplina;
  }

  async update({ nome, codigo, usuarioCriadorId }: DisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo
      }
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const disciplina = await this.prisma.disciplina.update({
      where: {
        codigo: codigo
      },
      data: {
        nome,
        codigo,
        usuarioCriadorId
      }
    });

    return disciplina;
  }

  async remove({ codigo }: DisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo: codigo
      }
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const provasExists = await this.prisma.prova.findMany({
      where: {
        disciplinaId: disciplinaExists.id
      }
    });

    if (provasExists) {
      provasExists.forEach(async (prova) => {
        await this.prisma.prova.delete({
          where: {
            id: prova.id
          }
        });
      });
    }

    const disciplina = await this.prisma.disciplina.delete({
      where: {
        codigo: codigo
      }
    });

    return disciplina;
  }
}
