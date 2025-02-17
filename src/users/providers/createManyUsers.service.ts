import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { error } from 'console';

@Injectable()
export class CreateManyUsersProvider {
  constructor(private readonly datasource: DataSource) {}

  public async createManyUsers(createUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (e) {
      console.error(e, 'Error in service createManyUsers');
      throw new RequestTimeoutException('Could not connect to the database');
    }
    try {
      for (const user of createUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e, 'Error in service createManyUsers');
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (e) {
        console.error(e, 'Error in service createManyUsers');
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }
    return newUsers;
  }
}
