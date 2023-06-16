import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from 'src/errors/AppError';
import { PrismaService } from '../database/PrismaService';

interface IPayload {
  sub: string;
}

@Injectable()
export class EnsureAuthenticated implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token is missing', 401);
    }

    const [, token] = authHeader.split(' ');
    

    try {
      const { sub: user_id } = verify(
        token,
        '22547f9e2c15eafc93cf454907f431f9',
      ) as IPayload;

      console.log(user_id);

      const user = await this.prisma.usuario.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new AppError('User does not exist', 404);
      }

      next();
    } catch {
      throw new AppError('Invalid Token!', 401);
    }
  }
}
