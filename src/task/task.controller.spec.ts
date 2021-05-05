import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('Get all task should return empty array with no tasks', () => {
    const tasks = controller.getAllTasks();
    expect(tasks).toEqual([]);
  });
  it('create task should return created item', () => {
    const tasks = controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    expect(tasks.id).toBeDefined();
    expect(tasks.title).toBeDefined();
    expect(tasks.title).toEqual('TEST TASK');
    expect(tasks.description).toBeDefined();
    expect(tasks.description).toEqual('TEST DESCRIPTION');
    expect(tasks.status).toBeDefined();
  });
  it('Get all task should return array with task', () => {
    controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    const tasks = controller.getAllTasks();
    expect(tasks.length).toEqual(1);
  });
  it('Find task by id', () => {
    const testTask = controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    const task = controller.getTaskById(testTask.id);
    expect(task).toEqual(testTask);
  });
  it('Delete tasks by id remove it from db', () => {
    const testTask = controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    const tasksBefor = controller.getAllTasks();
    expect(tasksBefor.length).toEqual(1);
    const task = controller.deleteTaskById(testTask.id);
    expect(task).toEqual(testTask);
    const tasksAfter = controller.getAllTasks();
    expect(tasksAfter).toEqual([]);
  });
});
