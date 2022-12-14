import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import {v4 as uuidv4} from 'uuid';

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

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.todoRepository.delete(id);
    if(deleteResult.affected !== 1){
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteByCompleted(completed: string) {
    
    if (completed === undefined || completed.toLowerCase() === "false"){
      console.log("here")
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
