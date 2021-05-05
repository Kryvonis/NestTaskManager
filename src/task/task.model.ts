export enum TaskStatus {
  OPEN = 'OPEN',
  PROGRESS = 'PROGRESS',
  DONE = 'OPEN',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
