import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { DisciplinaDTO } from './disciplina.dto';
import { DisciplinaAlunoDTO } from './disciplina-aluno.dto';
import { Disciplina } from '@prisma/client';

@Injectable()
export class DisciplinaService {
  constructor(private prisma: PrismaService) {}

  public async isProfessor(id: string) {
    const perfil = await this.prisma.perfil.findUnique({
      where: {
        id,
      },
    });

    return perfil.codigo === 'P';
  }

  async create({ nome, codigo, nomeCurso, usuarioCriadorId }: DisciplinaDTO) {
    let disciplina: Disciplina;
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

    const cursoExists = await this.prisma.curso.findUnique({
      where: {
        nome: nomeCurso,
      },
    });

    if (!cursoExists) {
      throw new AppError('Curso não existe');
    }

    disciplina = await this.prisma.disciplina.create({
      data: {
        nome,
        codigo,
        usuarioCriadorId: professor.id,
        Curso: {
          connect: {
            nome: nomeCurso
          }
        }
      },
    });

    return disciplina;
  }

  async update({ nome, codigo, nomeCurso }: DisciplinaDTO) {
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
        nome,
        codigo,
        Curso: {
          connect: {
            nome: nomeCurso
          }
        },
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

  async findDisciplinasPorUsuario(username: string): Promise<Disciplina[]> {
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

      const disciplinasProfessor = await this.prisma.disciplina.findMany({
        where: {
          usuarioCriadorId: professor.id,
        },
      });

      return disciplinasProfessor;
    } else {
      const aluno = await this.prisma.aluno.findUnique({
        where: {
          usuarioId: usuario.id,
        },
      });

      const disciplinasAluno = await this.prisma.disciplina.findMany({
        where: {
          Aluno: {
            some: {
              usuarioId: aluno.usuarioId,
            },
          },
        },
        include: {
          Prova: true,
        },
      });

      return disciplinasAluno;
    }
  }

  async removeCursoDisciplina({ codigo, nomeCurso }: DisciplinaDTO) {
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
            nome: nomeCurso
          }
        },
      },
    });

    return disciplina;
  }

  async addCursoDisciplina({ codigo, nomeCurso }: DisciplinaDTO) {
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
            nome: nomeCurso
          }
        },
      },
    });

    return disciplina;
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
