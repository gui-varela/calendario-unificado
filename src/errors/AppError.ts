import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message?: string, statusCode?: HttpStatus) {
    super(message, statusCode || HttpStatus.BAD_REQUEST);
  }
}