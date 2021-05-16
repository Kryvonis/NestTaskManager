import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UNIQUE_CONSTRAINT_ERROR } from 'src/config/error.codes';
import { EntityRepository, Repository } from 'typeorm';

import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const user = new User();
    user.username = username;
    user.password = password;
    try {
      await user.save();
    } catch (error) {
      if (error.code === UNIQUE_CONSTRAINT_ERROR) {
        throw new ConflictException('Username already exist');
      }
      throw new InternalServerErrorException();
    }
  }
}
