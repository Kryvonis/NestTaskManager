import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskValidation } from './pipes/create-task-validation.pipe';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private logger = new Logger('TaskController');
  constructor(private taskService: TaskService) {}
  @Get()
  getTasks(
    @GetUser() user: User,
    @Query(ValidationPipe) filterDto?: FilterTaskDto,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User: ${user.username} retrieve all tasks. Filters ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.taskService.getTasks(user, filterDto);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body(new CreateTaskValidation()) createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTask(id, { status } as UpdateTaskDto, user);
  }
}
