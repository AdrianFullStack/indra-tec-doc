import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = exception.getStatus() ?? 500;

            console.log('exception', exception)

        if (statusCode === 400) {
            const responseBody = exception.getResponse();
            return response.status(statusCode).json({
                message: 'Error en la solicitud',
                data: responseBody['message'] ?? undefined
            });
        } else {
            return response.status(statusCode).json({
                message: 'Error interno del servidor.',
                data: undefined
            });
        }
    }
}