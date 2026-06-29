import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Recuperar la cookie gracias a cookie-parser
        const token = request.cookies['access_token'];
        //const token = request.signedCookies['access_token'];

        if (!token) {
            throw new UnauthorizedException('No hay sesión activa');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: 'TU_SECRETO_SUPER_SEGURO',
            });
            // Asignar el payload al request para usarlo en los controladores
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Sesión inválida o expirada');
        }
        return true;
    }
}