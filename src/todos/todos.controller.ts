import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, Put, HttpException, HttpStatus } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('')
  @HttpCode(201)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto)
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response =  await this.todosService.findOne(id);
    if(response === null){
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return response;
  }

  @Patch(':id')
  async updatePartialy(@Param('id') id: string, @Body() updatePartialTodoDto: UpdatePartialTodoDto) {
    try{
      return await this.todosService.updatePartialy(id, updatePartialTodoDto);
    }
    catch(e){
      if(e.message === 'Not Found'){
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      if(e.message === 'Conflict'){
        throw new HttpException('Conflict', HttpStatus.CONFLICT);
      }
    }
  }

  @Put(':id')
  async updateTotally(@Param('id') id: string, @Body() updateTotallyTodoDto: UpdateTodoDto){
    try{
      await this.todosService.updateTotally(id, updateTotallyTodoDto)
    }
    catch(e){
      if(e.message === 'Not Found'){
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      if(e.message === 'Conflict'){
        throw new HttpException('Conflict', HttpStatus.CONFLICT);
      }
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    try{
      return await this.todosService.remove(id);
    } 
    catch(e){
      if(e.message === 'Not Found'){
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
      }
    }
  }

  @Delete(':completed?')
  @HttpCode(204)
  deleteByCompleted(@Query('completed') completed: string){
    return this.todosService.deleteByCompleted(completed);
  }
}
