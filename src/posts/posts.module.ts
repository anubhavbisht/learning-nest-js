import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination.module';
import { CreatePostProvider } from './providers/create-post.provider';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CreatePostProvider],
  imports: [
    UsersModule,
    TagsModule,
    PaginationModule,
    TypeOrmModule.forFeature([Post]),
  ],
})
export class PostsModule {}
