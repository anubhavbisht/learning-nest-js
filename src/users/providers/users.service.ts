import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { CreateManyUsersProvider } from './createManyUsers.provider';
import { CreateUserProvider } from './createUser.provider';
import { FindUserByEmailProvider } from './findUserByEmail.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/googleUser.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly usersCreateManyProvider: CreateManyUsersProvider,
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
    private readonly createGooogleUserProvider: CreateGoogleUserProvider,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public findAll() {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.userRepository.findOneBy({
        id,
      });
    } catch (e) {
      console.error(e, 'Error in service findOneById');
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }
    if (!user) {
      throw new BadRequestException('User id does not exists');
    }
    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createManyUsers(
      createManyUsersDto,
    );
  }

  public async findUserByEmail(email: string) {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGooogleUserProvider.createGoogleUser(googleUser);
  }
}
