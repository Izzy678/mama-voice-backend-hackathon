import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'An unexpected error occurred';

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message =
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as { message?: string }).message ?? exception.message;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`[${request.method}] ${request.url} — ${message}`, exception instanceof Error ? exception.stack : '');
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            data: null,
        });
    }
}
