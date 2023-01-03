import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

export class NotFoundError extends Error {
    constructor(message='Not Found') {
        super(message);
    }
}

@Catch(NotFoundError)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
      .status(404)
      .json({
        statusCode: 404,
        timestamp: new Date().toISOString(),
        path: request.url,
        text: 'Data not Found'
      });
  }
}
