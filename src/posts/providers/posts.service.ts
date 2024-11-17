import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(public readonly usersService: UsersService) {}
  public findAll(userId: string) {
    // Users Service
    // Find A User
    const user = this.usersService.findOneById(userId);
    return [
      {
        user,
        title: 'Test Tile',
        content: 'Test Content',
      },
      {
        user,
        title: 'Test Tile 2',
        content: 'Test Content 2',
      },
    ];
  }

  public createPost(createPostDto: CreatePostDto) {
    console.log('Hello from service createPost');
    return createPostDto;
  }
}
