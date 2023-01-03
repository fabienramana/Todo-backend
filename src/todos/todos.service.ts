import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, Repository } from "typeorm";
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { Todo } from './entities/todo.entity';
import {v4 as uuidv4} from 'uuid';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoNotFoundError } from './errors/todo-not-found.error';
import { OrderAlreadyExistingError } from './errors/order-already-existing.error';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ){}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todoToSave: Todo = await this.mapTo(createTodoDto)
    return this.todoRepository.save(todoToSave);
  }

  async findAll(): Promise<Todo[]> {
    return this.getAllRecordsDesc();
  }

  async findOne(id: string): Promise<Todo> {
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      throw new TodoNotFoundError()
    }
    return todo;
  }

  async updatePartialy(id: string, updatePartialTodoDto: UpdatePartialTodoDto){
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      throw new TodoNotFoundError()
    }

    if("order" in updatePartialTodoDto){
      const order = updatePartialTodoDto.order
      const todoByOrder: Todo = await this.todoRepository.findOneBy({
        order: order as number,
      })
      if(todoByOrder !== null){
        throw new OrderAlreadyExistingError()
      }
    }

    await this.todoRepository.update(id, updatePartialTodoDto);
    return this.todoRepository.findOneBy({id})
  }

  async updateTotally(id: string, updateTotallyTodoDto: UpdateTodoDto){
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      throw new TodoNotFoundError()
    }

    const order = updateTotallyTodoDto.order
    const todoByOrder: Todo = await this.todoRepository.findOneBy({
      order: order as number,
    })
    if(todoByOrder !== null){
      throw new OrderAlreadyExistingError()
    }
    await this.todoRepository.update(id, updateTotallyTodoDto);
    return this.todoRepository.findOneBy({id})
  }

  async remove(id: string){
    const deleteResult = await this.todoRepository.delete(id);
    if(deleteResult.affected !== 1){
      throw new TodoNotFoundError()
    }
  }

  async deleteByCompleted(completed: string) {
    console.log(completed)
    if (completed === undefined || completed.toLowerCase() === "false"){
      const getAllRecords = await this.getAllRecordsDesc()
      this.todoRepository.remove(getAllRecords)
    }
    else if(completed.toLowerCase() === "true"){
      this.todoRepository.delete({completed: true})
    }
  }

  private async mapTo(createTodoDto: CreateTodoDto): Promise<Todo>{
    const newuuid: string = uuidv4();
    const max = await this.getMaxOrderRow().then()

    const todoToSave: Todo = {
        id: newuuid,
        order: max.max+1,
        title: createTodoDto.title,
        completed: false
    }

    return todoToSave;
  }

  private getAllRecordsDesc(): Promise<Todo[]> {
    return this.todoRepository.find({
      order: {
          order: "DESC",
      },
  })
  }

  private getMaxOrderRow(){
    const query = this.todoRepository
                  .createQueryBuilder("todo")
                  .select("MAX(todo.order)", "max");
    return query.getRawOne();
  }
}
