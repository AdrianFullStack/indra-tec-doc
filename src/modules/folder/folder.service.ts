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

  create(createFolderDto: CreateFolderDto) {
    const { name, parentId } = createFolderDto;
    return this.prisma.folder.create({
      data: {
        name: name,
        position: 1,
        ownerId: 'b1c62e7f-3036-4a9a-8a57-75f366fa39ca',
        folderId: parentId ?? null
      },
      select: this.selectFolder
    });
  }

  async findAll() {
    const folders = await this.prisma.folder.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          ...this.selectFolder,
          folderId: true
        }
      });
    
    return buildTree(folders);
  }

  findOne(id: string) {
    return this.prisma.folder.findUnique({
      where: { id },
      select: this.selectFolder
    });
  }

  update(id: string, updateFolderDto: UpdateFolderDto) {
    return this.prisma.folder.update({
      where: { id },
      data: {
        ...updateFolderDto,
        updatedAt: new Date()
      },
      select: this.selectFolder
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.folder.delete({
      where: { id }
    });
  }
}
