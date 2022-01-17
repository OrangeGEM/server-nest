import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordAuthUserDto {
    @ApiProperty({required: true})
    readonly oldPassword: string;
    @ApiProperty({required: true})
    readonly newPassword: string;
}