import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) { }

  static CODIGO_PERFIL_PROFESSOR = 'P';

  static isUsuarioProfessor(codigoPerfil: string) {
    return codigoPerfil === this.CODIGO_PERFIL_PROFESSOR;
  }

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

    if (!ProfessorService.isUsuarioProfessor(perfil.codigo)) {
      throw new AppError('Este usuário não tem perfil de professor');
    }

    return professor;
  }
}
