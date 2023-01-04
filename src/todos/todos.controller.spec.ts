import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';
import { DeleteResult } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoNotFoundError } from './errors/todo-not-found.error';
import { OrderAlreadyExistingError } from './errors/order-already-existing.error';

describe('TodosController', () => {
  let app: INestApplication;

  const mockTodosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updatePartialy: jest.fn(),
    updateTotally: jest.fn(),
    remove: jest.fn(),
    deleteAllTodos: jest.fn(),
    deleteTodosCompleted: jest.fn()
  } 


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
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(TodosService)
    .useValue(mockTodosService)
    .compile();

    app = module.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  });
 
  it(`/GET todos`, () => {

    mockTodosService.findAll.mockResolvedValueOnce(todos)

    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect(todos);
  });

  it('/POST todos/create', () => {
    const createTodoDto: CreateTodoDto = {title:"Do chores"}
    const todo: Todo = {
      id:"ddd",
      order: todos.length+1,
      title: "Do chores",
      completed: false
    }
    mockTodosService.create.mockResolvedValueOnce(todo)

    return request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .expect(201)
      .expect(todo);
  })

  it('/POST todos/create fail because there is no title', () => {
    const todo: Todo = {
      id:"ddd",
      order: todos.length+1,
      title: "Do chores",
      completed: false
    }
    mockTodosService.create.mockResolvedValueOnce(todo)

    return request(app.getHttpServer())
      .post('/todos')
      .send({title:""})
      .expect(400);
  })

  it('/GET todos/${id} success', () => {
    const id: string = "aaa"

    mockTodosService.findOne.mockResolvedValueOnce(todos.filter((todo) => todo.id === id)[0])

    return request(app.getHttpServer())
      .get(`/todos/${id}`)
      .expect(200)
      .expect(todos[0]);
  })

  it('/GET todos/${id} not found', () => {
    const id: string = "zzz"

    mockTodosService.findOne.mockImplementation(() => {
      throw new TodoNotFoundError()
    });

    return request(app.getHttpServer())
      .get(`/todos/${id}`)
      .expect(404);
  })

  it('/PATCH todos/${id} success', () => {
    const id: string = "aaa"
    const body = {title: "Do chores"}

    mockTodosService.updatePartialy.mockResolvedValueOnce(undefined)

    return request(app.getHttpServer())

      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect("");
  })

  it('/PATCH todos/${id} not found', () => {
    const id: string = "aaa"
    const body = {title: "Do chores"}

    mockTodosService.updatePartialy.mockImplementation(() => {
      throw new TodoNotFoundError();
    });

    return request(app.getHttpServer())

      .patch(`/todos/${id}`)
      .send(body)
      .expect(404);
  })

  it('/PATCH todos/${id} conflict', () => {
    const id: string = "aaa"
    const body = {title: "Do chores"}

    mockTodosService.updatePartialy.mockImplementation(() => {
      throw new OrderAlreadyExistingError();
    });

    return request(app.getHttpServer())

      .patch(`/todos/${id}`)
      .send(body)
      .expect(409);
  })

  it('/PUT todos/${id} success', () => {
    const id: string = "aaa"
    const body = {
      title: "Do chores",
      completed: false,
      order:1
    }

    mockTodosService.updateTotally.mockResolvedValueOnce(undefined)

    return request(app.getHttpServer())

      .put(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect("");
  })

  it('/PUT todos/${id} not found', () => {
    const id: string = "aaa"
    const body = {
      title: "Do chores",
      completed: false,
      order:1
    }

    mockTodosService.updateTotally.mockImplementation(() => {
      throw new TodoNotFoundError();
    });

    return request(app.getHttpServer())

      .put(`/todos/${id}`)
      .send(body)
      .expect(404);
  })

  it('/PUT todos/${id} conflict', () => {
    const id: string = "aaa"
    const body = {
      title: "Do chores",
      completed: false,
      order:1
    }

    mockTodosService.updateTotally.mockImplementation(() => {
      throw new OrderAlreadyExistingError();
    });

    return request(app.getHttpServer())

      .put(`/todos/${id}`)
      .send(body)
      .expect(409);
  })

  it('/DELETE todos/${id} success', () => {
    const id: string = "aaa"
    const deleteResult: DeleteResult = {
      affected:1,
      raw:1
    }

    mockTodosService.remove.mockResolvedValueOnce(undefined)

    return request(app.getHttpServer())
      .delete(`/todos/${id}`)
      .expect(204)
      .expect('');
  })

  it('/DELETE todos/${id} Not found', () => {
    const id: string = "aaa"

    mockTodosService.remove.mockImplementation(() => {
      throw new TodoNotFoundError()
    })

    return request(app.getHttpServer())
      .delete(`/todos/${id}`)
      .expect(404);
  })

  it('/DELETE todos?completed=true', () => {
    const url: string = "/todos?completed=true"
    

    mockTodosService.deleteTodosCompleted.mockImplementation(null)

    return request(app.getHttpServer())
      .delete(url)
      .expect(204);
  })

  it('/DELETE todos?completed=false', () => {
    const url: string = "/todos?completed=false"
    

    mockTodosService.deleteAllTodos.mockImplementation(null);

    return request(app.getHttpServer())
      .delete(url)
      .expect(204);
  })

  it('/DELETE todos', () => {
    const url: string = "/todos"
    

    mockTodosService.deleteAllTodos.mockImplementation(null);

    return request(app.getHttpServer())
      .delete(url)
      .expect(204);
  }) 

  afterAll(async () => {
    await app.close();
  });
});