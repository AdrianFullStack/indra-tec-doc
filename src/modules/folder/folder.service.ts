import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { buildTree } from 'src/shared';

@Injectable()
export class FolderService {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  private readonly selectFolder: Prisma.FolderSelect = {
    id: true,
    name: true
  }

  create(createFolderDto: CreateFolderDto, userId: string) {
    const { name, parentId } = createFolderDto;
    return this.prisma.folder.create({
      data: {
        name: name,
        position: 1,
        ownerId: userId,
        folderId: parentId ?? null
      },
      select: this.selectFolder
    });
  }

  async findAll(userId: string) {
    const folders = await this.prisma.folder.findMany({
        where: {
          ownerId: userId
        },
        orderBy: { createdAt: 'desc' },
        select: {
          ...this.selectFolder,
          folderId: true
        }
      });
    
    return buildTree(folders);
  }

  findOne(id: string, userId: string) {
    return this.prisma.folder.findUnique({
      where: {
        id,
        ownerId: userId
      },
      select: this.selectFolder
    });
  }

  update(
    id: string,
    updateFolderDto: UpdateFolderDto,
    userId: string
  ) {
    return this.prisma.folder.update({
      where: {
        id,
        ownerId: userId
      },
      data: {
        ...updateFolderDto,
        updatedAt: new Date()
      },
      select: this.selectFolder
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.prisma.folder.delete({
      where: {
        id,
        ownerId: userId
      }
    });
  }
}
