import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import {
  ApiExcludeEndpoint,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('Folder')
@ApiCookieAuth()
@Controller('folders')
@UseGuards(AuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) { }


  @Post()
  @ApiOperation({ summary: 'Crear carpeta' })
  @ApiResponse({ status: 200, description: 'Se crea carpeta correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  create(
    @Body() createFolderDto: CreateFolderDto,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.create(createFolderDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de carpetas' })
  @ApiResponse({ status: 200, description: 'Se lista carpetas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAll(
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carpeta' })
  @ApiResponse({ status: 200, description: 'Se lista carpeta correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findOne(
    @Param('id') id: string,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de carpeta' })
  @ApiResponse({ status: 200, description: 'Se actualiza datos de carpeta correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.update(id, updateFolderDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carpeta' })
  @ApiResponse({ status: 200, description: 'Se elimina carpeta correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  remove(
    @Param('id') id: string,
    @AuthUser('sub') userId: string
  ) {
    return this.folderService.remove(id, userId);
  }

  @Get(':id/files')
  @ApiExcludeEndpoint()
  findFiles(
    @Param('id') id: string,
    @AuthUser('sub') userId: string
  ) {
    return {
      message: 'Se listan todos los archivos de la carpeta'
    };
  }
}
