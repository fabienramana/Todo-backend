import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Todo } from "../todos/entities/todo.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'todo-backend',
    entities: [Todo],
    synchronize: true,
  }