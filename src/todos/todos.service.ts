import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { Todo } from './entities/todo.entity';
import {v4 as uuidv4} from 'uuid';
import { UpdateTodoDto } from './dto/update-todo.dto';

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
    return todo;
  }

  async updatePartialy(id: string, updatePartialTodoDto: UpdatePartialTodoDto): Promise<Todo> {
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      return todo;
    }

    if("order" in updatePartialTodoDto){
      const order = updatePartialTodoDto.order
      console.log(order)
      const todoByOrder: Todo = await this.todoRepository.findOneBy({
        order: order as number,
      })
      if(todoByOrder !== null){
        return todoByOrder;
      }
    }

    this.todoRepository.update(id, updatePartialTodoDto);
  }

  async updateTotally(id: string, updateTotallyTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      return todo;
    }

    const order = updateTotallyTodoDto.order
    const todoByOrder: Todo = await this.todoRepository.findOneBy({
      order: order as number,
    })
    if(todoByOrder !== null){
      return todoByOrder;
    }
    this.todoRepository.update(id, updateTotallyTodoDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.todoRepository.delete(id);
  }

  async deleteByCompleted(completed: string) {
    if (completed === undefined || completed.toLowerCase() === "false"){
      const getAllRecords = await this.getAllRecordsDesc()
      this.todoRepository.remove(getAllRecords)
    }
    else if(completed.toLowerCase() === "true"){
      this.todoRepository.delete({completed: true})
    }
  }

  async mapTo(createTodoDto: CreateTodoDto): Promise<Todo>{
    let newuuid: string = uuidv4();
    const max = await this.getMaxOrderRow().then()

    const todoToSave: Todo = {
        id: newuuid,
        order: max.max+1,
        title: createTodoDto.title,
        completed: false
    }

    return todoToSave;
  }

  getAllRecordsDesc(): Promise<Todo[]> {
    return this.todoRepository.find({
      order: {
          order: "DESC",
      },
  })
  }

  getMaxOrderRow(){
    const query = this.todoRepository
                  .createQueryBuilder("todo")
                  .select("MAX(todo.order)", "max");
    return query.getRawOne();
  }
}
