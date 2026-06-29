import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FindByEmailDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string
}