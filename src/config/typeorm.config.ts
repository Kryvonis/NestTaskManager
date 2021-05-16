import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmTestConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'taskmanagement_test',
  autoLoadEntities: true,
  synchronize: true,
};

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'taskmanagement',
  autoLoadEntities: true,
  synchronize: true,
};
