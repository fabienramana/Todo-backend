import { IsNotEmpty } from "class-validator";

export class UpdateTodoDto {

    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    completed: boolean;

    @IsNotEmpty()
    order: number
}
