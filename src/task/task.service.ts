import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskModule } from './task.module';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  async getTasks(filter?: FilterTaskDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filter);
  }
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number): Promise<void> {
    const resultTasks = await this.taskRepository.delete(id);
    if (!resultTasks.affected) {
      throw new NotFoundException();
    }
  }
  async updateTask(id: number, updatedTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    return this.taskRepository.updateTask(task, updatedTaskDto);
  }
}
