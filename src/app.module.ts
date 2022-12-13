import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';
import { Todo } from 'src/todos/entities/todo.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'todo-backend',
      entities: [Todo],
      synchronize: true,
    }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

/* @Module({
  imports: [
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
}) */
export class AppModule {}
