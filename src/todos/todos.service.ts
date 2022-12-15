import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

  findAll(): Promise<Todo[]> {
    return this.getAllRecordsDesc();
  }

  async findOne(id: string): Promise<Todo> {
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return todo;
  }

  async updatePartialy(id: string, updatePartialTodoDto: UpdatePartialTodoDto) {
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if("order" in updatePartialTodoDto){
      const order = updatePartialTodoDto.order
      const todo: Todo = await this.todoRepository.findOneBy({
        order: order as number,
      })
      if(todo !== null){
        throw new HttpException('Conflict', HttpStatus.CONFLICT);
      }
    }

    this.todoRepository.update(id, updatePartialTodoDto);
  }

  async updateTotally(id: string, updateTotallyTodoDto: UpdateTodoDto) {
    const todo: Todo =  await this.todoRepository.findOneBy({id});
    if(todo === null){
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const order = updateTotallyTodoDto.order
    const todoByOrder: Todo = await this.todoRepository.findOneBy({
      order: order as number,
    })
    if(todoByOrder !== null){
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
    this.todoRepository.update(id, updateTotallyTodoDto);
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.todoRepository.delete(id);
    if(deleteResult.affected !== 1){
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteByCompleted(completed: string) {
    
    if (completed === undefined || completed.toLowerCase() === "false"){
      const getAllRecords = await this.getAllRecordsDesc()
      this.todoRepository.remove(getAllRecords)
    }
    else if(completed.toLowerCase() === "true"){
      this.todoRepository.delete({completed: true})
    }
    else{
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async mapTo(createTodoDto: CreateTodoDto): Promise<Todo>{
    let newuuid: string = uuidv4();
    const lastOrder: number = await this.getLastOrder().then()

    const todoToSave: Todo = {
        id: newuuid,
        order: lastOrder,
        title: createTodoDto.title,
        completed: false
    }

    return todoToSave;
  }

  async getLastOrder(): Promise<number>{
    const allRecordsPromise = this.getAllRecordsDesc()
    const allRecords: Todo[] =  await allRecordsPromise.then()

    if(allRecords.length === 0){
      return 1;
    }
    return allRecords[0].order+1
  }

  getAllRecordsDesc(): Promise<Todo[]> {
    return this.todoRepository.find({
      order: {
          order: "DESC",
      },
  })
  }
}
