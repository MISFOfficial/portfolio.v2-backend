import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse['message']
        ? exceptionResponse['message']
        : exceptionResponse;

    const error =
      typeof exceptionResponse === 'object' && exceptionResponse['error']
        ? exceptionResponse['error']
        : undefined;

    // Terminal Logging
    this.logger.error(
      `${(request as any).method} ${(request as any).url} ${status} - Message: ${
        Array.isArray(message) ? message.join(', ') : message
      }`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    (response as any).status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      error: error,
      path: (request as any).url,
      timestamp: new Date().toISOString(),
    });
  }
}
