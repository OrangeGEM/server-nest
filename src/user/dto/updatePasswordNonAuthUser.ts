import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordNonAuthUserDto {
    @ApiProperty({required: true})
    readonly token: string;
    @ApiProperty({required: true})
    readonly password: string;
}