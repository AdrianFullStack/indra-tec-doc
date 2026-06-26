import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    // constructor(private reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        if (statusCode === HttpStatus.OK) {
            return next.handle().pipe(
                map(data => {
                    if (data?.data) {
                        return {
                            message: 'Proceso terminado exitosamente',
                            ...data
                        }
                    }
                    
                    return {
                        message: 'Proceso terminado exitosamente',
                        data
                    }
                })
            );
        }

        if (statusCode === HttpStatus.CREATED) {
            return next.handle().pipe(
                map(data => {
                    return {
                        message: 'Recurso creado exitosamente',
                        data
                    }
                })
            )
        }

        /*if (statusCode.toString().startsWith('4')) {
            return next.handle().pipe(
                map(data => {
                    return {
                        message: 'Error en la solicitud',
                        data
                    }
                })
            )
        }
        */

        return next.handle();
    }
}