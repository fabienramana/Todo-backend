import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "../entities/todo.entity";
import { Repository } from "typeorm";
import {v4 as uuidv4} from 'uuid';
import { CreateTodoDto } from "./create-todo.dto";
import { create } from "domain";

export class TodoMapper {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>
      ){}

      mapTo(createTodoDto: CreateTodoDto): Todo{
        let newuuid = uuidv4();
        const lastIndexInRepo = this.todoRepository.count()
        const todoToSave: Todo = {
            id: newuuid,
            order: 1,
            title: createTodoDto.title,
            completed: false
        }
        return todoToSave;
      }
}
