import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FindByEmailDto {
    @ApiProperty({ example: 'usuario@correo.com' })
    @IsEmail()
    email!: string
}