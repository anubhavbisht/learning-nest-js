import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import profileConfig from '../config/profile.config';
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
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public findAll() {
    const envVar = this.configService.get('S3_BUCKET');
    console.log(envVar);
    console.log(this.profileConfiguration.apiKey);
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
