import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { ApiErrorResponse } from './api-response';

// Prisma errors that mean a client mistake, not a server fault.
const PRISMA_ERRORS: Record<string, { status: number; message: string }> = {
  P2002: { status: HttpStatus.CONFLICT, message: 'Resource already exists' },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Resource not found' },
};

// Global filter: turns every thrown error into an ApiErrorResponse type.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'string'
          ? body
          : ((body as { message?: string | string[] }).message ??
            exception.message);
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code in PRISMA_ERRORS
    ) {
      ({ status, message } = PRISMA_ERRORS[exception.code]);
    } else {
      // Unknown error: do not leak details to the client
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }
    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        exception instanceof Error ? exception.stack : undefined,
      );
    }
    const responseBody: ApiErrorResponse = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.path,
    };

    response.status(status).json(responseBody);
  }
}
