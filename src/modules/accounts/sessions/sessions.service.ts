import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../../../database/PrismaService';
import { AppError } from 'src/errors/AppError';
import { SessionDTO } from '../user/session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create({ username, password }: SessionDTO) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AppError('Usuário ou senha incorretos', 401);
    }

    const sessionExists = await this.prisma.session.findUnique({
      where: {
        usuarioId: user.id,
      },
    });

    if (sessionExists) {
      throw new AppError('Usuário já possui sessão', 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Usuário ou senha incorretos', 401);
    }

    const token = sign({}, '22547f9e2c15eafc93cf454907f431f9', {
      subject: user.id,
      expiresIn: '1d',
    });

    const userReturn = {
      user: {
        email: user.email,
        username: user.username,
      },
    };

    const session = await this.prisma.session.create({
      data: {
        token,
        usuarioId: user.id,
      },
    });

    return { session, userReturn };
  }

  async logout({ username}: SessionDTO) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    const sessionExists = await this.prisma.session.findUnique({
      where: {
        usuarioId: user.id,
      },
    });

    if (!sessionExists) {
      throw new AppError('Usuário não possui sessão', 401);
    }

    const userReturn = {
      user: {
        email: user.email,
        username: user.username,
      },
    };

    const session = await this.prisma.session.delete({
      where: {
        usuarioId: user.id,
      },
    });

    return { userReturn };
  }
}
