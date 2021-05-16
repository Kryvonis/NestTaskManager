import { typeOrmTestConfig } from 'src/config/typeorm.config';

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { TABLE_NAME } from './user.entity';
import { UserRepository } from './user.repository';

describe('AuthController', () => {
  let controller: AuthController;
  let module: TestingModule;
  let repository: UserRepository;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmTestConfig), AuthModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    repository = module.get<UserRepository>(UserRepository);
  });
  afterAll(async () => {
    await module.close();
  });
  afterEach(async () => {
    await repository.query(`DELETE FROM "${TABLE_NAME}";`);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Create user', async () => {
    await controller.signUp({ username: 'TEST', password: 'TEST' });
    const [user] = await repository.query(`SELECT * FROM "${TABLE_NAME}"`);

    expect(user.username).toEqual('TEST');
    expect(user.password).toEqual('TEST');
  });
});
