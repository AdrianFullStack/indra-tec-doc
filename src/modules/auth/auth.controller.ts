import { Controller, Post, Body, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión y obtener cookie' })
    @ApiResponse({ status: 200, description: 'Sesión iniciada exitosamente.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, payload } = await this.authService.login(loginDto.email, loginDto.password);

        // Configurar la cookie segura
        res.cookie('access_token', accessToken, {
            httpOnly: true, // Invisible para JavaScript del frontend
            signed: true,
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'strict', // Previene ataques CSRF
            maxAge: 1000 * 60 * 60, // 1 hora
        });

        return {
            ...payload
        };
    }
    /*
        @Post('forgot-password')
        async forgotPassword(@Body('email') email: string) {
            return this.authService.forgotPassword(email);
        }
    */
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión y eliminar cookie' })
    async logout(
        @Res({ passthrough: true }) res: Response
    ) {
        res.clearCookie('access_token');
        return { message: 'Sesión cerrada' };
    }
}