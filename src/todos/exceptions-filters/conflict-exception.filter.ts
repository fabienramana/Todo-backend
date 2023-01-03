import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { OrderAlreadyExistingError } from '../errors/order-already-existing.error';

@Catch(OrderAlreadyExistingError)
export class OrderAlreadyExistingFilter implements ExceptionFilter {
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
        text: 'Conflict - Order already exists'
      });
  }
}
