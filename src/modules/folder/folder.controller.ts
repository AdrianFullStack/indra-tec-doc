import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';

@Controller('folders')
@UseGuards(AuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(
    @Body() createFolderDto: CreateFolderDto,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.create(createFolderDto, userId);
  }

  @Get()
  findAll(
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.update(id, updateFolderDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.remove(id, userId);
  }

  @Get(':id/files')
  findFiles(
    @Param('id') id: string,
    @AuthUser('sub') userId: string
  ) {
    return {
      message: 'Se listan todos los archivos de la carpeta'
    };
  }
}
