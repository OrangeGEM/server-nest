import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordNonAuthLinkDto {
    @ApiProperty({required: true})
    readonly email: string;
}