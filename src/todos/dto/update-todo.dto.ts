import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateTodoDto {

    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    title: string;
    
    @IsBoolean()
    completed: boolean;

    @IsNumber()
    order: number
}
