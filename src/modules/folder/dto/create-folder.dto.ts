import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateFolderDto {
    @ApiProperty({
        description: 'Nombre de la carpeta',
        example: 'Folder name'
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: 'UUID de la carpeta padre',
        example: 'ff023fd0-d7d9-48b7-b4a0-a0aab181b6a6',
        required: false
    })
    @IsString()
    @IsOptional()
    parentId!: string 
}
