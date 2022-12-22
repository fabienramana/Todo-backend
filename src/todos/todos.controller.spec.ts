import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';
import { DeleteResult } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdatePartialTodoDto } from './dto/update-partial-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { resolve } from 'path';

describe('TodosController', () => {
  let app: INestApplication;

  let mockTodosService = {
    findAll: () => {return todos;},
    create: (createTodoDto: CreateTodoDto) => {},
    findOne: (id: string) => {},
    updatePartialy: (id: string, updatePartialTodoDto: UpdatePartialTodoDto) => {
      return todos[0]
    },
    updateTotally: (id: string, updateTotallyTodoDto: UpdateTodoDto) => {
      return todos[0]
    },
    remove: (id: string) => {
        const deleteResult: DeleteResult = { affected: 1, raw: 1 };
        return deleteResult
    },
    deleteByCompleted: (completed: string) => {
      return;
    }
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
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect(mockTodosService.findAll());
  });

  it('/POST todos/create', () => {
    const createTodoDto: CreateTodoDto = {title:"Do chores"}
    const todo: Todo = {
      id:"ddd",
      order: todos.length+1,
      title: "Do chores",
      completed: false
    }
    jest.spyOn(mockTodosService, 'create').mockImplementation(() => todo);

    return request(app.getHttpServer())
      .post('/todos/create')
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
    jest.spyOn(mockTodosService, 'create').mockImplementation(() => todo);

    return request(app.getHttpServer())
      .post('/todos/create')
      .send({title:""})
      .expect(400);
  })

  it('/GET todos/${id} success', () => {
    const id: string = "aaa"

    jest.spyOn(mockTodosService, 'findOne').mockImplementation(() => todos.filter((todo) => todo.id === id)[0]);

    return request(app.getHttpServer())
      .get(`/todos/${id}`)
      .expect(200)
      .expect(todos[0]);
  })

  it('/GET todos/${id} not found', () => {
    const id: string = "zzz"

    jest.spyOn(mockTodosService, 'findOne').mockImplementation(() => {return new Promise((resolve, reject) => resolve(null))});

    return request(app.getHttpServer())
      .get(`/todos/${id}`)
      .expect(404);
  })

  it('/PATCH todos/${id} success', () => {
    const id: string = "aaa"
    const body = {title: "Do chores"}

    jest.spyOn(mockTodosService, 'updatePartialy').mockImplementation(() => {return undefined});

    return request(app.getHttpServer())

      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect("");
  })

  it('/PATCH todos/${id} not found', () => {
    const id: string = "aaa"
    const body = {title: "Do chores"}

    jest.spyOn(mockTodosService, 'updatePartialy').mockImplementation(() => {return null});

    return request(app.getHttpServer())

      .patch(`/todos/${id}`)
      .send(body)
      .expect(404);
  })

  it('/PATCH todos/${id} conflict', () => {
    const id: string = "aaa"
    const body = {title: "Do chores"}

    jest.spyOn(mockTodosService, 'updatePartialy').mockImplementation(() => {return todos[0]});

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

    jest.spyOn(mockTodosService, 'updateTotally').mockImplementation(() => {return undefined});

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

    jest.spyOn(mockTodosService, 'updateTotally').mockImplementation(() => {return null});

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

    jest.spyOn(mockTodosService, 'updateTotally').mockImplementation(() => {return todos[0]});

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

    jest.spyOn(mockTodosService, 'remove').mockImplementation(() => {return deleteResult});

    return request(app.getHttpServer())
      .delete(`/todos/${id}`)
      .expect(204)
      .expect('');
  })

  it('/DELETE todos/${id} Not found', () => {
    const id: string = "aaa"
    const deleteResult: DeleteResult = {
      affected:0,
      raw:1
    }

    jest.spyOn(mockTodosService, 'remove').mockImplementation(() => {return deleteResult});

    return request(app.getHttpServer())
      .delete(`/todos/${id}`)
      .expect(404);
  })

  it('/DELETE todos/${id} Not found', () => {
    const id: string = "aaa"
    const deleteResult: DeleteResult = {
      affected:0,
      raw:1
    }

    jest.spyOn(mockTodosService, 'remove').mockImplementation(() => {return deleteResult});

    return request(app.getHttpServer())
      .delete(`/todos/${id}`)
      .expect(404);
  })

  it('/DELETE todos?completed=true', () => {
    const url: string = "/todos?completed=true"
    

    jest.spyOn(mockTodosService, 'deleteByCompleted').mockImplementation(() => {return });

    return request(app.getHttpServer())
      .delete(url)
      .expect(204);
  })

  it('/DELETE todos?completed=false', () => {
    const url: string = "/todos?completed=false"
    

    jest.spyOn(mockTodosService, 'deleteByCompleted').mockImplementation(() => {return });

    return request(app.getHttpServer())
      .delete(url)
      .expect(204);
  })

  it('/DELETE todos', () => {
    const url: string = "/todos"
    

    jest.spyOn(mockTodosService, 'deleteByCompleted').mockImplementation(() => {return });

    return request(app.getHttpServer())
      .delete(url)
      .expect(204);
  })

  afterAll(async () => {
    await app.close();
  });
});