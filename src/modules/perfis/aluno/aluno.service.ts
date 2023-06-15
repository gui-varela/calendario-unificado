import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async findAlunoPorUsuarioId(usuarioId: string) {
    const usuario = await this.prisma.aluno.findUniqueOrThrow({
      where: {
        usuarioId,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    return usuario;
  }
}
