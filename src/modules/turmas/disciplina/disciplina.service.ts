import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { DisciplinaDTO } from './disciplina.dto';

@Injectable()
export class DisciplinaService {
  constructor(private prisma: PrismaService) { }

  public async isProfessor(id: string) {
    const perfil = await this.prisma.perfil.findUnique({
      where: {
        id
      }
    });

    return perfil.codigo == 'P'
  }

  async create({ nome, codigo, usuarioCriadorId }: DisciplinaDTO) {
    const disciplinaAlreadyExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo
      }
    });

    if (disciplinaAlreadyExists) {
      throw new AppError('Disciplina já existe');
    }

    const professor = await this.prisma.professor.findUnique({
      where: {
        usuarioId: usuarioCriadorId
      }
    });

    if (!professor) {
      throw new AppError('Não existe professor');
    }

    const disciplina = await this.prisma.disciplina.create({
      data: {
        nome,
        codigo,
        usuarioCriadorId: professor.id
      }
    });

    return disciplina;
  }

  async update({ nome, codigo }: DisciplinaDTO) {
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
        codigo
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

  async findDisciplinasPorUsuario(username: string) {
    let disciplinas;
    const usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: {
        username,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    if (this.isProfessor(usuario.perfilId)) {
      const professor = await this.prisma.professor.findUnique({
        where: {
          usuarioId: usuario.id
        }
      });
      disciplinas = await this.prisma.disciplina.findMany({
        where: {
          usuarioCriadorId: professor.id
        },
      });
    } else {
      const aluno = await this.prisma.aluno.findUnique({
        where: {
          usuarioId: usuario.id
        }
      });
      disciplinas = await this.prisma.disciplina.findMany({
        where: {
          Aluno: {
            every: {
              usuarioId: usuario.id
            }
          }
        },
      });
    }
    return disciplinas;
  }
}
