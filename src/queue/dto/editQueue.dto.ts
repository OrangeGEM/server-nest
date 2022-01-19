import { IsNotEmpty } from "class-validator";

export class EditQueueDto {
    @IsNotEmpty()
    readonly id: number;

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly keyword: string;

    readonly description: string; 
    readonly date: Date;
}