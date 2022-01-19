import { IsNotEmpty } from "class-validator";

export class CreateQueueDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly keyword: string;

    readonly description: string; 
    readonly date: Date;
}