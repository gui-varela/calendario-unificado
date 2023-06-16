import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { DisciplinaAlunoDTO } from './disciplina-aluno.dto';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) { }

  static CODIGO_PERFIL_ALUNO = 'A';

  static isUsuarioAluno(codigoPerfil: string) {
    return codigoPerfil === this.CODIGO_PERFIL_ALUNO;
  }

  async findAlunoPorUsuarioId(usuarioId: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: {
        usuarioId,
      },
    });

    if (!aluno) {
      throw new AppError('Aluno não existe');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: usuarioId,
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

    return aluno;
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

    const existeDisciplina = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!existeDisciplina) {
      throw new AppError('Disciplina não existe');
    }

    const alunoInscrito = await this.prisma.disciplina.findFirst({
      where: {
        id: disciplinaId,
        Aluno: {
          some: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    if (alunoInscrito) {
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

  async removeDisciplinaDoAluno({ username, disciplinaId }: DisciplinaAlunoDTO) {
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

    const existeDisciplina = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!existeDisciplina) {
      throw new AppError('Disciplina não existe');
    }

    const alunoInscrito = await this.prisma.disciplina.findFirst({
      where: {
        id: disciplinaId,
        Aluno: {
          some: {
            usuarioId: usuario.id,
          },
        },
      },
    });

    if (!alunoInscrito) {
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
}
