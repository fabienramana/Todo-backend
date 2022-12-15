import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, Put } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('create')
  @HttpCode(201)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto)
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  updatePartialy(@Param('id') id: string, @Body() updatePartialTodoDto: UpdatePartialTodoDto) {
    return this.todosService.updatePartialy(id, updatePartialTodoDto);
  }

  @Put(':id')
  updateTotally(@Param('id') id: string, @Body() updateTotallyTodoDto: UpdateTodoDto){
    return this.todosService.updateTotally(id, updateTotallyTodoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }

  @Delete(':completed?')
  @HttpCode(204)
  deleteByCompleted(@Query('completed') completed: string){
    return this.todosService.deleteByCompleted(completed);
  }
}
