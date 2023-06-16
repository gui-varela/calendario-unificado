import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { ProvaDTO } from './prova.dto';
import { DisciplinaService } from '../disciplina/disciplina.service';
import { Prova } from '@prisma/client';

@Injectable()
export class ProvaService {
  constructor(
    private prisma: PrismaService,
    private disciplinaService: DisciplinaService,
  ) {}

  async create({ nome, data, disciplinaId }: ProvaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const existeProva = await this.prisma.prova.findFirst({
      where: {
        disciplinaId: disciplinaId,
        nome: nome,
      },
    });

    if (existeProva) {
      throw new AppError('Essa prova já foi marcada');
    }

    const prova = await this.prisma.prova.create({
      data: {
        nome,
        data,
        disciplinaId,
      },
    });

    return prova;
  }

  async update({ nome, data, disciplinaId }: ProvaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const provaMarcada = await this.prisma.prova.findFirst({
      where: {
        disciplinaId: disciplinaId,
        nome: nome,
      },
    });

    if (!provaMarcada) {
      throw new AppError('Essa prova não existe');
    }

    const prova = await this.prisma.prova.update({
      where: {
        id: provaMarcada.id,
      },
      data: {
        nome,
        data,
        disciplinaId,
      },
    });

    return prova;
  }

  async remove({ nome, disciplinaId }: ProvaDTO) {
    const disciplinaExists = await this.prisma.disciplina.findUnique({
      where: {
        id: disciplinaId,
      },
    });

    if (!disciplinaExists) {
      throw new AppError('Disciplina não existe');
    }

    const provaMarcada = await this.prisma.prova.findFirst({
      where: {
        disciplinaId: disciplinaId,
        nome: nome,
      },
    });

    if (!provaMarcada) {
      throw new AppError('Essa prova não existe');
    }

    const prova = await this.prisma.prova.delete({
      where: {
        id: provaMarcada.id,
      },
    });

    return prova;
  }

  async findProvasPorDisciplina(disciplinaId: string) {
    const provas = await this.prisma.prova.findMany({
      where: {
        disciplinaId,
      },
    });

    return provas;
  }

  async findProvasPorUsuario(username: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!usuario) {
      throw new AppError('Usuário não existe');
    }

    const disciplinasUsuario =
      await this.disciplinaService.findDisciplinasPorUsuario(usuario.username);

    if (!disciplinasUsuario) {
      throw new AppError('Usuário não está inscrito em nenhuma disciplina');
    }

    const provasUsuario: ProvaDTO[] = [];

    await Promise.all(
      disciplinasUsuario.map(async (disciplina) => {
        const provas = await this.findProvasPorDisciplina(disciplina.id);

        provas.forEach((prova) => {
          const provaComNomeDisciplina = {
            ...prova,
            disciplina: disciplina.nome,
          };
          provasUsuario.push(provaComNomeDisciplina);
        });
      }),
    );

    const perfil = await this.prisma.perfil.findUnique({
      where: {
        id: usuario.perfilId,
      },
    });

    if (provasUsuario.length === 0) {
      throw new AppError(`O ${perfil.nome} não tem provas agendadas`);
    }

    return provasUsuario.sort();
  }
}
