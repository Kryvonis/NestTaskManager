import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilter({ status, search }: FilterTaskDto): Task[] {
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter(({ status: taskStatus }) => status === taskStatus);
    }

    if (search) {
      tasks = tasks.filter(
        ({ title, description }) =>
          title.includes(search) || description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
  deleteTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
    return task;
  }

  updateTask(id: string, updatedTaskDto: UpdateTaskDto): Task {
    const task = this.getTaskById(id);
    const { title, description, status } = updatedTaskDto;
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (status) {
      task.status = TaskStatus[status];
    }
    return task;
  }
}
