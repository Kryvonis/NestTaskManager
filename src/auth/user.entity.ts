import * as bcrypt from 'bcrypt';
import { Task } from 'src/task/task.entity';
import {
  BaseEntity,
  Column,
  Entity,
  IsNull,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export const TABLE_NAME = 'user';
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hashPassword(password, this.salt);
    return hash === this.password;
  }
}
