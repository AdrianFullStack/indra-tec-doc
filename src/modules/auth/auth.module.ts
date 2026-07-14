import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: 'TU_SECRETO_SUPER_SEGURO',
            signOptions: {
                expiresIn: '1h'
            }
        }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [{
        provide: AuthService,
        inject: [JwtService, UserService],
        useFactory: (jwt: JwtService, user: UserService) => {
            return new AuthService(jwt, user)
        }
    }]
})
export class AuthModule { }
