import { ApiProperty } from "@nestjs/swagger";

export class EditMemberDto {
    @ApiProperty({required: true})
    readonly id: number;
    
    @ApiProperty({required: true})
    readonly phone: string;

    @ApiProperty({required: true})
    readonly date: Date;
}