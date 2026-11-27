import { Injectable } from '@nestjs/common';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { S3Service } from 'src/common/s3/s3.service';
import { Prisma } from "@prisma/client";
import { basename, extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly s3: S3Service
  ) {}

  private readonly selectFile: Prisma.FolderSelect = {
    id: true,
    name: true
  }

  async create(file: Express.Multer.File, folderId: string, userId: string) {
    const key = `${userId}/${folderId ?? 'root'}/${randomUUID()}`;

    await this.s3.upload(key, file.buffer, file.mimetype);

    const extension = extname(file.originalname);
    return this.prisma.file.create({
      data: {
        name: basename(file.originalname, extension),
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: Number(BigInt(file.size)),
        extension: extension.slice(1),
        key: key,
        bucket: this.configService.getOrThrow('aws.bucket'),
        ownerId: userId,
        folderId,
      }
    });
  }

  async findAll(
    params: {
      page?: number,
      limit?: number,
      search?: string
    }
  ) {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.FileWhereInput = search ? {
      name: { contains: search, mode: 'insensitive' }
    } : {}

    const [files, total] = await this.prisma.$transaction([
      this.prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          ...this.selectFile,
          folderId: true
        }
      }),
      this.prisma.file.count({ where })
    ])
    
    return {
      data: files,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string) {
    const file = await this.prisma.file.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        key: true,
        bucket: true
      }
    });

    return {
      url: await this.s3.getDownloadUrl(file?.key)
    }
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    return this.prisma.file.update({
      data: {
        name: updateFileDto.name
      },
      where: {
        id
      }
    });
  }

  async remove(id: string): Promise<void> {
    const file = await this.prisma.file.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        key: true,
        bucket: true
      }
    });

    await this.s3.delete(file.key);
    await this.prisma.file.delete({
      where: { id }
    });
  }
}
