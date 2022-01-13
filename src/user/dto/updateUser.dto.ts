import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    readonly username: string
    readonly fullName: string
    readonly image: string;
    readonly lang: string
    readonly isActive: boolean
}