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

    const ID_PERFIL_ALUNO = '3f40be47-c0ca-4512-8e13-5e407b52aa93';

    const isUsuarioAluno = usuario.perfilId === ID_PERFIL_ALUNO;

    if (!isUsuarioAluno) {
      throw new AppError('Este usuário não tem perfil de aluno');
    }

    return aluno;
  }
}
