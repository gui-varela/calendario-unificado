import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async findAlunoPorUsuarioId(usuarioId: string) {
    const aluno = await this.prisma.aluno.findUniqueOrThrow({
      where: {
        usuarioId,
      },
    });

    if (!aluno) {
      throw new AppError('Usuário não existe');
    }

    const usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: {
        id: usuarioId,
      },
    });

    const ID_PERFIL_ALUNO = 'd75a712e-1879-4da7-a4ac-f9950fc239f4';

    const isUsuarioAluno = usuario.perfilId === ID_PERFIL_ALUNO;

    if (!isUsuarioAluno) {
      throw new AppError('Este usuário não tem perfil de aluno');
    }

    return aluno;
  }
}
