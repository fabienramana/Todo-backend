import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @Column()
  id: string;

  @PrimaryGeneratedColumn()
  order: number;

  @Column()
  title: string;

  @Column()
  completed: boolean;
}
