import { TaskStatus } from '../task.model';

export class UpdateTaskStatusDto {
  status: TaskStatus;
}

export class UpdateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}
