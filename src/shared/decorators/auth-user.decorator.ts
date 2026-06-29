import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common';

export const AuthUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // Si pasamos un argumento al decorador (ej: @User('id')), devuelve solo esa propiedad
        return data ? user?.[data] : user;
    },
);