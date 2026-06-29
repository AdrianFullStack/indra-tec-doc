import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        // private mailerService: MailerService,
        // private usersService: UsersService // Inyecta tu servicio de usuarios
    ) { }

    async login(email: string, pass: string) {
        // 1. Buscar usuario (Mockup)
        // const user = await this.usersService.findByEmail(email);
        const user = {
            id: 1,
            email: 'rasuclupe@example.com',
            password: '$2b$10$...hash'
        };

        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        // 2. Verificar contraseña
        // const isMatch = await bcrypt.compare(pass, user.password);
        const isMatch = true; // Simulación

        if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

        // 3. Generar JWT
        const payload = { sub: user.id, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }
/*
    async forgotPassword(email: string) {
        // 1. Verificar si el usuario existe
        // const user = await this.usersService.findByEmail(email);
        const user = { id: 1, email: 'test@test.com' };
        if (!user) throw new NotFoundException('Usuario no encontrado');

        // 2. Generar token temporal para reseteo (ej: expira en 15 min)
        const resetToken = await this.jwtService.signAsync(
            { sub: user.id },
            { secret: 'SECRETO_RECOVERY', expiresIn: '15m' }
        );

        // 3. Crear enlace de recuperación (apunta a tu frontend)
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        // 4. Enviar correo
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Recuperación de contraseña',
            html: `
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <a href="${resetUrl}">Restablecer contraseña</a>
        <p>Si no fuiste tú, ignora este correo.</p>
      `,
        });

        return { message: 'Correo de recuperación enviado exitosamente' };
    }
*/
}