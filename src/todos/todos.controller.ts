import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, Put, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { NotFoundFilter } from './exceptions-filters/not-found-exception.filter';
import { ConflictError, ConflictFilter } from './exceptions-filters/conflict-exception.filter';

@Controller('todos')
@UseFilters(new NotFoundFilter(), new ConflictFilter())
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
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
    return await this.todosService.findOne(id);
  }

  @Patch(':id')
  async updatePartialy(@Param('id') id: string, @Body() updatePartialTodoDto: UpdatePartialTodoDto) {
    return await this.todosService.updatePartialy(id, updatePartialTodoDto);
  }

  @Put(':id')
  async updateTotally(@Param('id') id: string, @Body() updateTotallyTodoDto: UpdateTodoDto){
    return await this.todosService.updateTotally(id, updateTotallyTodoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.todosService.remove(id);
  }

  @Delete(':completed?')
  @HttpCode(204)
  deleteByCompleted(@Query('completed') completed: string){
    return this.todosService.deleteByCompleted(completed);
  }
}
