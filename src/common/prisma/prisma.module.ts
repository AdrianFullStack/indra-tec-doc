import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: PrismaService,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new PrismaService(configService);
            },
        },
    ],
    exports: [PrismaService],
})
export class PrismaModule { }