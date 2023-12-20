
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const exc = exception.getResponse()
    let message = exc['message']; 
    if(Array.isArray(message)){
      message.forEach((item: string) => message = item)
    }
    response
      .status(exc['statusCode'])
      .json({
        statusCode: exc['statusCode'],
        name: exc['error'],
        message
      });
  }
}