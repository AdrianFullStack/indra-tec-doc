import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    folderId!: string;
}
