import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import {
  ApiExcludeEndpoint,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
@ApiTags('File')
@ApiCookieAuth()
@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Crear archivo' })
  @ApiResponse({ status: 200, description: 'Se crea archivo correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpg' })
        ]
      })
    ) file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @AuthUser('sub') userId: string
  ) {
    return this.fileService.create(
      file,
      createFileDto.folderId,
      userId
    );
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = ''
  ) {
    return this.fileService.findAll({ page, limit, search });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.fileService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto
  ) {
    return this.fileService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.fileService.remove(id);
  }
}
