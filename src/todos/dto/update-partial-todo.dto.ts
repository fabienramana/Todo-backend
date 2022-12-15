import { PartialType } from '@nestjs/mapped-types';
import { UpdateTodoDto } from './update-todo.dto';

export class UpdatePartialTodoDto extends PartialType(UpdateTodoDto) {}
