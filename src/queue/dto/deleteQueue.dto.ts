import { IsNotEmpty } from "class-validator";

export class DeleteQueueDto {
    @IsNotEmpty()
    id: number;
}