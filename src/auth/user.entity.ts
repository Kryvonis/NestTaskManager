import { IsEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  IsNull,
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
}
