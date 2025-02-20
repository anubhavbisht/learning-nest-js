import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public async findUserByEmail(email: string) {
    let user: User | undefined = undefined;
    try {
      user = await this.userRepository.findOneBy({
        email,
      });
    } catch (e) {
      console.error(e, 'Error in provider findUserByEmail');
      throw new RequestTimeoutException(e, {
        description: 'Could not fetch the user',
      });
    }
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return user;
  }
}
