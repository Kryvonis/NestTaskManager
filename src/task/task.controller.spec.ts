import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmTestConfig } from '../config/typeorm.config';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskController } from './task.controller';
import { TABLE_NAME } from './task.entity';
import { TaskModule } from './task.module';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  let module: TestingModule;
  let repository: TaskRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmTestConfig), TaskModule],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    repository = module.get<TaskRepository>(TaskRepository);
  });
  afterAll(async () => {
    module.close();
  });
  afterEach(async () => {
    await repository.query(`DELETE FROM ${TABLE_NAME};`);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('Get all task should return empty array with no tasks', async () => {
    const tasks = await controller.getTasks();
    expect(tasks).toEqual([]);
  });
  it('create task should return created item', async () => {
    const tasks = await controller.createTask({
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
  it('Get all task should return array with task', async () => {
    await controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    const tasks = await controller.getTasks();
    expect(tasks.length).toEqual(1);
  });
  it('Find task by id', async () => {
    const testTask = await controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    const task = await controller.getTaskById(testTask.id);
    expect(task).toEqual(testTask);
  });
  it('Find task by id that not exist should throw an error', async () => {
    await expect(controller.getTaskById(10)).rejects.toThrowError(
      NotFoundException,
    );
  });
  it('Delete tasks by id remove it from db', async () => {
    const testTask = await controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    const tasksBefore = await controller.getTasks();
    expect(tasksBefore.length).toEqual(1);
    await controller.deleteTaskById(testTask.id);
    const tasksAfter = await controller.getTasks();
    expect(tasksAfter).toEqual([]);
  });
  it('Update task by id', async () => {
    const testTask = await controller.createTask({
      title: 'TEST TASK',
      description: 'TEST DESCRIPTION',
    });
    expect(testTask.status).toEqual('OPEN');
    const task = await controller.updateTaskStatus(testTask.id, 'DONE');
    expect(task.status).toEqual('OPEN');
  });
  it('Get all task with filter should return array with task', async () => {
    await controller.createTask({
      title: 'TEST TASK A',
      description: 'TEST DESCRIPTION',
    });
    await controller.createTask({
      title: 'TEST TASK B',
      description: 'TEST DESCRIPTION',
    });
    const tasks = await controller.getTasks({ search: 'B' } as FilterTaskDto);
    expect(tasks.length).toEqual(1);
  });

  it('Create task with empty title throw an error', async () => {
    const res = await controller.createTask({
      title: '',
      description: 'TEST DESCRIPTION',
    });
    console.log(res);

    expect(res.status).toEqual(400);
  });
});
