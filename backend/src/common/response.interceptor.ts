import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  success: true;
  statusCode: number;
  data: T;
}

// Interceptor for handling successful response
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        data: data,
      })),
    );
  }
}
