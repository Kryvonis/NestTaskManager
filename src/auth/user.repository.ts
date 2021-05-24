import * as bcrypt from 'bcrypt';
import { UNIQUE_CONSTRAINT_ERROR } from 'src/config/error.codes';
import { EntityRepository, Repository } from 'typeorm';

import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;
    const user = new User();
    user.username = username;
    user.salt = bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === UNIQUE_CONSTRAINT_ERROR) {
        throw new ConflictException('Username already exist');
      }
      throw new InternalServerErrorException();
    }
  }
  async validatePassword(
    authCredentialDto: AuthCredentialDto,
  ): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }
    return null;
  }
  async hashPassword(pass: string, salt: string): Promise<string> {
    return bcrypt.hashPassword(pass, salt);
  }
}
