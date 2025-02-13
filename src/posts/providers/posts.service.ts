import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    public readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}
  public async findAll(userId: string) {
    const posts = await this.postRepository.find({
      // relations: {
      //   metaOptions: true,
      // },
    });

    return posts;
  }

  public async createPost(createPostDto: CreatePostDto) {
    let post = this.postRepository.create(createPostDto);
    post = await this.postRepository.save(post);
    return post;
  }

  public async delete(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    await this.postRepository.delete(id);
    if (post.metaOptions) {
      await this.metaOptionRepository.delete(post.metaOptions.id);
    }
    return { deleted: true, id: post.id };
  }
}
