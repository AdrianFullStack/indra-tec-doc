import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() loginDto: Record<string, any>,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken } = await this.authService.login(loginDto.email, loginDto.password);

        // Configurar la cookie segura
        res.cookie('access_token', accessToken, {
            httpOnly: true, // Invisible para JavaScript del frontend
            // signed: true,
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'strict', // Previene ataques CSRF
            maxAge: 1000 * 60 * 60, // 1 hora
        });

        return { message: 'Login exitoso' };
    }
    /*
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token');
        return { message: 'Sesión cerrada' };
    }
    */
}