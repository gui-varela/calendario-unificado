import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

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

    const CODIGO_PERFIL_ALUNO = 'A';

    const isUsuarioAluno = perfil.codigo === CODIGO_PERFIL_ALUNO;

    if (!isUsuarioAluno) {
      throw new AppError('Este usuário não tem perfil de aluno');
    }

    return aluno;
  }
}
