import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { CreateManyUsersProvider } from './providers/createManyUsers.provider';
import { CreateUserProvider } from './providers/createUser.provider';
import { FindUserByEmailProvider } from './providers/findUserByEmail.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateManyUsersProvider,
    CreateUserProvider,
    FindUserByEmailProvider,
  ],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
