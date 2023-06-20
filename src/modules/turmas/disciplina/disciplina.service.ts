import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { DisciplinaDTO } from './disciplina.dto';
import { Disciplina } from '@prisma/client';
import { ProfessorService } from 'src/modules/perfis/professor/professor.service';
import { AlunoService } from 'src/modules/perfis/aluno/aluno.service';

@Injectable()
export class DisciplinaService {
  constructor(private prisma: PrismaService) { }

  async create({ nome, codigo, nomesCursos, usuarioCriadorId }: DisciplinaDTO) {
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

    nomesCursos.forEach(async (curso) => {
      const cursoExists = await this.prisma.curso.findUnique({
        where: {
          nome: curso,
        },
      });

      if (!cursoExists) {
        return;
      }

      await this.prisma.disciplina.update({
        where: {
          codigo: codigo,
        },
        data: {
          Curso: {
            connect: {
              nome: curso,
            },
          },
        },
      });
    });

    return disciplina;
  }

  async update({ nome, codigo, nomesCursos }: DisciplinaDTO) {
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

    nomesCursos.forEach(async (curso) => {
      const cursoExists = await this.prisma.curso.findUnique({
        where: {
          nome: curso,
        },
      });

      if (!cursoExists) {
        return;
      }

      await this.prisma.disciplina.update({
        where: {
          codigo: codigo,
        },
        data: {
          Curso: {
            connect: {
              nome: curso,
            },
          },
        },
      });
    });

    return disciplina;
  }

  async remove({ codigo }: DisciplinaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        codigo,
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

    const perfil = await this.prisma.perfil.findUnique({
      where: {
        id: usuario.perfilId,
      },
    });

    if (ProfessorService.isUsuarioProfessor(perfil.codigo)) {
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

  async findCursosDaDisciplina({ codigo }: DisciplinaDTO) {
    const cursos = await this.prisma.curso.findMany({
      where: {
        disciplina: {
          some: {
            codigo: codigo,
          },
        },
      },
    });
    return cursos;
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
        nome: 'asc',
      },
    });

    if (disciplinas.length === 0) {
      throw new AppError('Nenhuma disciplina encontrada');
    }

    return disciplinas;
  }

  async getDetalhesDisciplnha(codigo: string) {
    const disciplina = await this.prisma.disciplina.findUnique({
      where: {
        codigo: codigo
      },
    });

    if (!disciplina) {
      throw new AppError('Nenhuma disciplina encontrada');
    }

    const cursos = await this.prisma.curso.findMany({
      where: {
        disciplina: {
          some: {
            codigo: codigo
          }
        }
      },
    });

    let nomesCurso = []

    cursos.forEach((curso) => { return nomesCurso.push(curso.nome) });

    const provas = await this.prisma.prova.findMany({
      where: {
        disciplinaId: disciplina.id,
      },
    });

    const detalhesDisciplina = [
      {
        "codigo": codigo,
        "nome": disciplina.nome,
        "cursos": nomesCurso,
        "provas": provas
      }
    ]

    return detalhesDisciplina;
  }

  async getDisciplinas(username: string) {
    const todasDisciplinas = await this.prisma.disciplina.findMany();

    if (todasDisciplinas.length === 0) {
      throw new AppError('Nenhuma disciplina encontrada');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    const perfil = await this.prisma.perfil.findUnique({
      where: {
        id: usuario.perfilId,
      },
    });

    if (!perfil) {
      throw new AppError('Perfil não existe');
    }

    if (!AlunoService.isUsuarioAluno(perfil.codigo)) {
      throw new AppError('Este usuário não tem perfil de aluno');
    }

    const disciplinasAluno = await this.prisma.disciplina.findMany({
      where: {
        Aluno: {
          some: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    let disciplinas = [];
    let disciplinaInfoAlunoInscrito: any;

    todasDisciplinas.forEach((disciplina) => {
      disciplinaInfoAlunoInscrito = disciplina;
      disciplinasAluno.some((disciplinaAluno) => {
        if (disciplinaAluno.id === disciplinaInfoAlunoInscrito.id) {
          return disciplinaInfoAlunoInscrito.isAlunoInscrito = true;
        } else {
          return disciplinaInfoAlunoInscrito.isAlunoInscrito = false;
        }
      })
      disciplinas.push(disciplinaInfoAlunoInscrito);
    })

    return disciplinas;
  }
}
