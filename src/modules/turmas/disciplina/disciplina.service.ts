import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { DisciplinaDTO } from './disciplina.dto';
import { DisciplinaAlunoDTO } from './disciplina-aluno.dto';

@Injectable()
export class DisciplinaService {
  constructor(private prisma: PrismaService) { }

  public async isProfessor(id: string) {
    const perfil = await this.prisma.perfil.findUnique({
      where: {
        id,
      },
    });

    return perfil.codigo === 'P';
  }

  async create({ nome, codigo, usuarioCriadorId }: DisciplinaDTO) {
    const disciplinaAlreadyExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo,
      },
    });

    if (disciplinaAlreadyExists) {
      throw new AppError('Disciplina já existe');
    }

    const professor = await this.prisma.professor.findUnique({
      where: {
        usuarioId: usuarioCriadorId,
      },
    });

    if (!professor) {
      throw new AppError('Professor não existe');
    }

    const disciplina = await this.prisma.disciplina.create({
      data: {
        nome,
        codigo,
        usuarioCriadorId: professor.id,
      },
    });

    return disciplina;
  }

  async update({ nome, codigo }: DisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const disciplina = await this.prisma.disciplina.update({
      where: {
        codigo: codigo,
      },
      data: {
        nome,
        codigo,
      },
    });

    return disciplina;
  }

  async remove({ codigo }: DisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo: codigo,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const provasExists = await this.prisma.prova.findMany({
      where: {
        disciplinaId: disciplinaExists.id,
      },
    });

    if (provasExists) {
      provasExists.forEach(async (prova) => {
        await this.prisma.prova.delete({
          where: {
            id: prova.id,
          },
        });
      });
    }

    const disciplina = await this.prisma.disciplina.delete({
      where: {
        codigo: codigo,
      },
    });

    return disciplina;
  }

  async findDisciplinasPorUsuario(username: string) {
    let disciplinas;
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    if ((await this.isProfessor(usuario.perfilId)) === true) {
      const professor = await this.prisma.professor.findUnique({
        where: {
          usuarioId: usuario.id,
        },
      });
      disciplinas = await this.prisma.disciplina.findMany({
        where: {
          usuarioCriadorId: professor.id,
        },
      });
    } else {
      const aluno = await this.prisma.aluno.findUnique({
        where: {
          usuarioId: usuario.id,
        },
      });
      disciplinas = await this.prisma.disciplina.findMany({
        where: {
          Aluno: {
            some: {
              usuarioId: usuario.id,
            },
          },
        },
      });
    }
    return disciplinas;
  }

  async addDisciplinaAoAluno({ username, disciplinaId }: DisciplinaAlunoDTO) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    if ((await this.isProfessor(usuario.perfilId)) === true) {
      throw new AppError('Usuário não é aluno');
    }

    const existeDisciplina = await this.prisma.disciplina.findFirst({
      where: {
        id: disciplinaId,
        Aluno: {
          some: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    if (existeDisciplina) {
      throw new AppError('Disciplina já adicionada');
    }

    const disciplina = await this.prisma.disciplina.update({
      where: {
        id: disciplinaId,
      },
      data: {
        Aluno: {
          connect: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    return disciplina;
  }

  async removeDisciplinaDoAluno({
    username,
    disciplinaId,
  }: DisciplinaAlunoDTO) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    if ((await this.isProfessor(usuario.perfilId)) === true) {
      throw new AppError('Usuário não é aluno');
    }

    const existeDisciplina = await this.prisma.disciplina.findFirst({
      where: {
        id: disciplinaId,
        Aluno: {
          some: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    if (!existeDisciplina) {
      throw new AppError('Aluno não cursa essa disciplina');
    }

    const disciplina = await this.prisma.disciplina.update({
      where: {
        id: disciplinaId,
      },
      data: {
        Aluno: {
          disconnect: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    return disciplina;
  }

  async findDisciplinasPorNomeOuCodigo(nome?: string, codigo?: string) {
    const disciplinas = await this.prisma.disciplina.findMany({
      where: {
        OR: [
          {
            codigo: {
              contains: codigo,
            },
            nome: {
              contains: nome,
            },
          },
        ],
      },
      orderBy: {
        nome: 'asc'
      },
    });

    if (disciplinas.length === 0) {
      throw new AppError('Nenhuma disciplina encontrada');
    }

    return disciplinas;
  }
}
