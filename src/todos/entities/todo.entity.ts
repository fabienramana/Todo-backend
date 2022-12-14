import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  order: number;

  @Column()
  title: string;

  @Column("boolean")
  completed: boolean;
}
