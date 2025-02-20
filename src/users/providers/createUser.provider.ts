import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingService: HashingProvider,
  ) {}
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
    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingService.hashPassword(createUserDto.password),
    });
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
