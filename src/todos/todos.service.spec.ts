import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { OrderAlreadyExistingError } from './errors/order-already-existing.error';
import { TodoNotFoundError } from './errors/todo-not-found.error';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  const mockTodosRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockImplementationOnce(() => { return {max:0}})
    }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodosRepository
        }
      ],
    }).compile();

    jest.clearAllMocks();
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create function should be successful when called with createTodoDto', async () => {
    const title: string = "Do chores"
    const createdTodoDto: CreateTodoDto = {title}

    const todoSavedInBase: Todo = {
      id: 'aaa',
      title,
      order: 1,
      completed: false
    }

    mockTodosRepository.save.mockImplementationOnce((todo) => {
      todo.id = 'aaa'
      return todo;
    })

    const result = await service.create(createdTodoDto)

    expect(result).toEqual(todoSavedInBase)
    expect(mockTodosRepository.save).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.save).toHaveBeenCalledWith(todoSavedInBase)
  })

  it('findAll function should be successful', async () => {

    mockTodosRepository.find.mockResolvedValueOnce([])

    const result = await service.findAll();

    expect(result).toEqual([])
    expect(mockTodosRepository.find).toHaveBeenCalledTimes(1)
  })

  it('findOne function should be successful when called with right id', async () => {
    
    const id = 'aaa'

    const todo: Todo = {
      id,
      title: "Do chores",
      order: 1,
      completed: false,
    }
    mockTodosRepository.findOneBy.mockResolvedValueOnce(todo)

    const result = await service.findOne(id);

    expect(result).toEqual(todo)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
  })

  it('findOne function should fail if id is not retrieved in db', async () =>{
    const id = 'bbb'

    mockTodosRepository.findOneBy.mockResolvedValueOnce(null)

    expect(service.findOne(id)).rejects.toBeInstanceOf(TodoNotFoundError)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
  })

  it('updatePartialy function should be successful when called with right id and partial todo (without order)', async () =>{
    const id = 'aaa'

    const partialTodo: Partial<Todo> = {
      id,
      title: "Do chores",
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValue(todoReturned)

    const result = await service.updatePartialy(id, partialTodo)

    expect(result).toEqual(todoReturned)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(2)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
    expect(mockTodosRepository.update).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.update).toHaveBeenCalledWith(id, partialTodo)
  })

  it('updatePartialy function should be successful when called with right id and partial todo (with order)', async () =>{
    const id = 'aaa'

    const partialTodo: Partial<Todo> = {
      id,
      title: "Do chores",
      order:2,
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValueOnce(todoReturned)
    mockTodosRepository.findOneBy.mockResolvedValueOnce(null)

    const result = await service.updatePartialy(id, partialTodo)

    expect(result).toEqual(todoReturned)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(3)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
    expect(mockTodosRepository.update).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.update).toHaveBeenCalledWith(id, partialTodo)
  })

  it('updatePartialy function should throw an error if todo is not retrieved with id', async () =>{
    const id = 'aaa'

    const partialTodo: Partial<Todo> = {
      id,
      title: "Do chores",
      order:2,
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValueOnce(null)

    expect(service.updatePartialy(id, partialTodo)).rejects.toBeInstanceOf(TodoNotFoundError)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
  })

  it('updatePartialy function should throw an error if todo with existing order is retrieved', async () =>{
    const id = 'aaa'

    const partialTodo: Partial<Todo> = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValue(todoReturned)

    expect(service.updatePartialy(id, partialTodo)).rejects.toBeInstanceOf(OrderAlreadyExistingError)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
  })

  it('updateTotally function should be successful when called with right id and todo', async () =>{
    const id = 'aaa'

    const todo: Todo = {
      id,
      title: "Do chores",
      order:2,
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValueOnce(todoReturned)
    mockTodosRepository.findOneBy.mockResolvedValueOnce(null)

    const result = await service.updateTotally(id, todo)

    expect(result).toEqual(todoReturned)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(3)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
    expect(mockTodosRepository.update).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.update).toHaveBeenCalledWith(id, todo)
  })

  it('updateTotally function should throw an error if todo is not retrieved with id', async () =>{
    const id = 'aaa'

    const todo: Todo = {
      id,
      title: "Do chores",
      order:2,
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValueOnce(null)

    expect(service.updateTotally(id, todo)).rejects.toBeInstanceOf(TodoNotFoundError)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
  })

  it('updateTotally function should throw an error if todo with existing order is retrieved', async () =>{
    const id = 'aaa'

    const todo: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    const todoReturned: Todo = {
      id,
      title: "Do chores",
      order:1,
      completed: false
    }

    mockTodosRepository.update.mockResolvedValueOnce(null)
    mockTodosRepository.findOneBy.mockResolvedValue(todoReturned)

    expect(service.updateTotally(id, todo)).rejects.toBeInstanceOf(OrderAlreadyExistingError)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.findOneBy).toHaveBeenCalledWith({id})
  })

  it('remove function should be successful', async() => {
    const id: string = 'aaa'
    const deleteResult: DeleteResult = {affected:1, raw:""}

    mockTodosRepository.delete.mockResolvedValueOnce(deleteResult)

    const result = await service.remove(id)

    expect(result).toEqual(undefined)
    expect(mockTodosRepository.delete).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.delete).toHaveBeenCalledWith(id)
  })

  it('remove function should be failing if todo not retrieved', async() => {
    const id: string = 'aaa'
    const deleteResult: DeleteResult = {affected:0, raw:""}

    mockTodosRepository.delete.mockResolvedValueOnce(deleteResult)


    expect(service.remove(id)).rejects.toBeInstanceOf(TodoNotFoundError)
    expect(mockTodosRepository.delete).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.delete).toHaveBeenCalledWith(id)
  })

  it('deleteTodoCompleted function should be successful', async() => {
    const deleteResult: DeleteResult = {affected:0, raw:""}

    mockTodosRepository.delete.mockResolvedValueOnce(deleteResult)

    const result = await service.deleteTodosCompleted()

    expect(result).toEqual(undefined)
    expect(mockTodosRepository.delete).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.delete).toHaveBeenCalledWith({completed: true})
  })

  it('deleteAllTodos function should be successful', async() => {

    mockTodosRepository.find.mockResolvedValueOnce([])
    mockTodosRepository.remove.mockResolvedValueOnce(null)

    const result = await service.deleteAllTodos()

    expect(result).toEqual(undefined)
    expect(mockTodosRepository.find).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.find).toHaveBeenCalledWith({
      order: {
          order: "DESC",
      },
    })
    expect(mockTodosRepository.remove).toHaveBeenCalledTimes(1)
    expect(mockTodosRepository.remove).toHaveBeenCalledWith([])
  })
});
