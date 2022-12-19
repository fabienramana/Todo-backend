import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

describe('TodosController', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  const todos: Todo[] = [
    {
      id:'aaa',
      order:1,
      title: "Wash the car",
      completed: false
    },
    {
      id:'bbb',
      order:2,
      title: "Go to gym",
      completed: false
    },
    {
      id:'ccc',
      order:3,
      title: "Make food",
      completed: true
    },
  ]

  const mockRepository = {
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    todosController = module.get<TodosController>(TodosController);
    todosService = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
  });

  describe("findAll", () => {
    it('should returns an array of Todos when findAll is called', async() => {
      const result: Todo[] = todos;

      jest.spyOn(todosService, 'findAll').mockImplementation(async () => result);

      expect(await todosController.findAll()).toBe(result)
      expect(todosService.findAll).toHaveBeenCalledTimes(1)
      expect(todosService.findAll).toHaveBeenCalledWith()
    })
  })

  describe("create", () => {
    it('should be called with instance of CreateTodoDto and return a todo', async() => {
      const createTodoDto: CreateTodoDto = {title: "Eat medicates"}
      const result: Todo = todos[0];

      jest.spyOn(todosService, 'create').mockImplementation(async () => result);

      expect(await todosController.create(createTodoDto)).toBe(result)
      expect(todosService.create).toHaveBeenCalledTimes(1)
      expect(todosService.create).toHaveBeenCalledWith(createTodoDto)
    })
  })

  describe("findOne", () => {
    it('should be called with a string as id and return a todo', async() => {
      const id: string = "aaa"
      const result: Todo = todos[0];

      jest.spyOn(todosService, 'findOne').mockImplementation(async () => result);

      expect(await todosController.findOne(id)).toBe(result)
      expect(todosService.findOne).toHaveBeenCalledTimes(1)
      expect(todosService.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe("updatePartialy", () => {
    it('should be called with a string as id, a field to change in todo and return nothing', async() => {
      const id: string = "aaa"
      const updateTodoDto: UpdatePartialTodoDto = {title: "Eat medicates"}

      jest.spyOn(todosService, 'updatePartialy').mockImplementation();

      expect(await todosController.updatePartialy(id, updateTodoDto)).toEqual(undefined)
      expect(todosService.updatePartialy).toHaveBeenCalledTimes(1)
      expect(todosService.updatePartialy).toHaveBeenCalledWith(id, updateTodoDto)
    })
  })

  describe("updateTotally", () => {
    it('should be called with a string as id, a field to change in todo and return nothing', async() => {
      const id: string = "aaa"
      const updateTodoDto: UpdateTodoDto = {
        title: "Eat medicates",
        completed: false,
        order: 1, 
      }

      jest.spyOn(todosService, 'updateTotally').mockImplementation();

      expect(await todosController.updateTotally(id, updateTodoDto)).toEqual(undefined)
      expect(todosService.updateTotally).toHaveBeenCalledTimes(1)
      expect(todosService.updateTotally).toHaveBeenCalledWith(id, updateTodoDto)
    })
  })

  describe("remove", () => {
    it('should be called with a string as id and return nothing', async() => {
      const id: string = "aaa"

      jest.spyOn(todosService, 'remove').mockImplementation();

      expect(await todosController.remove(id)).toEqual(undefined)
      expect(todosService.remove).toHaveBeenCalledTimes(1)
      expect(todosService.remove).toHaveBeenCalledWith(id)
    })
  })

  describe("deleteByCompleted", () => {
    it('should be called with a string as completed value and return nothing', async() => {
      const completed: string = "true"

      jest.spyOn(todosService, 'deleteByCompleted').mockImplementation();

      expect(await todosController.deleteByCompleted(completed)).toEqual(undefined)
      expect(todosService.deleteByCompleted).toHaveBeenCalledTimes(1)
      expect(todosService.deleteByCompleted).toHaveBeenCalledWith(completed)
    })
  })
});