import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

export class ConflictError extends Error {
    constructor(message='Conflict') {
        super(message);
    }
}

@Catch(ConflictError)
export class ConflictFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
      .status(409)
      .json({
        statusCode: 409,
        timestamp: new Date().toISOString(),
        path: request.url,
        text: 'Conflict'
      });
  }
}
