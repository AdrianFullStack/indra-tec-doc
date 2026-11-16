// src/auth/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Obtener los roles requeridos para la ruta usando el Reflector
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si la ruta no tiene el decorador @Roles, se permite el acceso público/autenticado estándar
        if (!requiredRoles) {
            return true;
        }

        // 2. Obtener el usuario del request (inyectado previamente por el AuthGuard)
        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            throw new ForbiddenException('No tienes permisos para acceder a este recurso');
        }

        // 3. Validar si el rol del usuario coincide con los requeridos
        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
            throw new ForbiddenException(`Se requiere el rol: [${requiredRoles.join(', ')}]`);
        }

        return true;
    }
}