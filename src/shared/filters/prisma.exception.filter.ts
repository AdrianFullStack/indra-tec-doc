import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.code;

        console.log('exception', exception);

        if (statusCode === 'P1001') {
            return response.status(500).json({
                message: 'Error inesperado en la base de datos. Por favor, inténtelo de nuevo más tarde.',
            });
        }

        if (statusCode === 'P2025') {
            return response.status(HttpStatus.NOT_FOUND).json({
                message: 'Not found'
            });
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error.'
        })

    }
}