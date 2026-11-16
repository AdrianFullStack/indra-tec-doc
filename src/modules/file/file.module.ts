import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { S3Service } from 'src/common/s3/s3.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { S3Module } from 'src/common/s3/s3.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    S3Module
  ],
  controllers: [FileController], 
  providers: [{
    provide: FileService,
    inject: [
      ConfigService,
      PrismaService,
      S3Service
    ],
    useFactory: (
      configService: ConfigService,
      prisma: PrismaService,
      s3: S3Service
    ) => {
      return new FileService(configService, prisma, s3);
    },
  }],
})
export class FileModule { }
