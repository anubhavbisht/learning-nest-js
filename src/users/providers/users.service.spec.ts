import { Test, TestingModule } from '@nestjs/testing';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserProvider } from './createUser.provider';
import { CreateManyUsersProvider } from './createManyUsers.provider';
import { FindUserByEmailProvider } from './findUserByEmail.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google.provider';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockCreateUsersProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: CreateUserProvider, useValue: mockCreateUsersProvider },
        { provide: CreateManyUsersProvider, useValue: {} },
        { provide: FindUserByEmailProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    console.log(service);
    expect(service).toBeDefined();
  });
  describe('createUser', () => {
    it('Should be defined', () => {
      expect(service.createUser).toBeDefined();
    });

    it('Should call createUser on createUserProvider', async () => {
      const user = await service.createUser({
        firstName: 'john',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'password',
      });
      expect(user.firstName).toEqual('john');
    });
  });
});
