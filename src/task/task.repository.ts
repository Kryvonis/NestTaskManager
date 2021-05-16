import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task, TABLE_NAME } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filter?: FilterTaskDto): Promise<Task[]> {
    const { status, search } = { ...filter };
    const query = this.createQueryBuilder(`${TABLE_NAME}task`);
    if (status) {
      query.andWhere(`${TABLE_NAME}.status = :status`, { status });
    }
    if (search) {
      query.andWhere(
        `${TABLE_NAME}.name LIKE :search OR ${TABLE_NAME}.description LIKE :search`,
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
  async updateTask(task: Task, updatedTaskDto: UpdateTaskDto): Promise<Task> {
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
    await task.save();
    return task;
  }
}
