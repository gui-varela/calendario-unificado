import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async findProfessorPorUsuarioId(usuarioId: string) {
    const professor = await this.prisma.professor.findUniqueOrThrow({
      where: {
        usuarioId,
      },
    });

    const usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: {
        id: usuarioId,
      },
    });

    if (!professor) {
      throw new AppError('Usuário não existe');
    }

    const ID_PERFIL_PROFESSOR = 'd75a712e-1879-4da7-a4ac-f9950fc239f4';

    const isUsuarioProfessor = usuario.perfilId === ID_PERFIL_PROFESSOR;

    if (!isUsuarioProfessor) {
      throw new AppError('Este usuário não tem perfil de professor');
    }

    return professor;
  }
}
