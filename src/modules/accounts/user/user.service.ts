import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../../../database/PrismaService';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ email, username, password, codigoPerfil }: UserDTO) {
    const userAlreadyExists = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (userAlreadyExists) {
      throw new AppError('Username already used');
    }

    const passwordHash = await hash(password, 8);

    const perfil = await this.prisma.perfil.findUnique({
      where: {
        codigo: codigoPerfil,
      },
    });

    if (!perfil) {
      throw new AppError('Perfil não encontrado');
    }

    const user = await this.prisma.usuario.create({
      data: {
        email,
        username,
        password: passwordHash,
        perfilId: perfil.id,
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      perfilId: user.perfilId,
    };
  }
}
