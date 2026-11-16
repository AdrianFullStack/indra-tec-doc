import { Global, Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: S3Service,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new S3Service(configService);
            },
        },
    ],
    exports: [S3Service],
})
export class S3Module { }