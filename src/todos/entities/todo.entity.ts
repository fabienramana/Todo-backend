import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  order: number;

  @Column()
  title: string;

  @Column()
  completed: boolean;
}
