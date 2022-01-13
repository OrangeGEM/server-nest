import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({required: false})
    readonly username: string
    @ApiProperty({required: false})
    readonly fullName: string
    @ApiProperty({required: false})
    readonly image: string;
    @ApiProperty({required: false})
    readonly lang: string
    @ApiProperty({required: false})
    readonly isActive: boolean
}