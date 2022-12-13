import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoMapper } from './dto/todo-mapper';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private todoMapper: TodoMapper
  ){}

  create(createTodoDto: CreateTodoDto) {
    const todoToSave: Todo = this.todoMapper.mapTo(createTodoDto)
    return this.todoRepository.save(todoToSave);
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOneBy({id});
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
