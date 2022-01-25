import { ApiProperty } from "@nestjs/swagger";

export class CreateMemberDto {
    @ApiProperty({required: true})
    readonly phone: string;

    @ApiProperty({required: true})
    readonly date: Date;
}