import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { TodoNotFoundError } from '../errors/todo-not-found.error';

@Catch(TodoNotFoundError)
export class TodoNotFoundFilter implements ExceptionFilter {
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
        text: 'Todo not Found'
      });
  }
}
