import { ApiProperty } from "@nestjs/swagger";

export class ActivateUserDto {
    @ApiProperty({required: true})
    readonly token: string
}