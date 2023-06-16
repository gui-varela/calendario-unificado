import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async findProfessorPorUsuarioId(usuarioId: string) {
    const professor = await this.prisma.professor.findUnique({
      where: {
        usuarioId,
      },
    });

    if (!professor) {
      throw new AppError('Professor não existe');
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

    const CODIGO_PERFIL_PROFESSOR = 'P';

    const isUsuarioProfessor = perfil.codigo === CODIGO_PERFIL_PROFESSOR;

    if (!isUsuarioProfessor) {
      throw new AppError('Este usuário não tem perfil de professor');
    }

    return professor;
  }
}
