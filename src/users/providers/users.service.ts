import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
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
    let existingUser = undefined;
    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (e) {
      console.error(e, 'Error in service createUser');
      throw new RequestTimeoutException(
        'Unable to process your request,please try again later',
        { description: 'Error connecting to the database' },
      );
    }
    if (existingUser) {
      throw new BadRequestException('User with this email id already exists.');
    }
    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (e) {
      console.error(e, 'Error in service createUser');
      throw new RequestTimeoutException(
        'Unable to process your request,please try again later',
        { description: 'Error connecting to the database' },
      );
    }
    return newUser;
  }
}
