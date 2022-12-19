import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateTodoDto {  
    @IsNotEmpty()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    title: string;
}
