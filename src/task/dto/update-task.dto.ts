import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  status: TaskStatus;
}

export class UpdateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}
