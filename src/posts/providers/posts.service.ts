import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  public async findAll() {
    const posts = await this.postRepository.find({
      // relations: {
      //   metaOptions: true,
      //   author: true,
      //   tags: true,
      // },
    });

    return posts;
  }

  public async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    let post = this.postRepository.create({
      ...createPostDto,
      author,
      tags,
    });
    post = await this.postRepository.save(post);
    return post;
  }

  public async update(patchPostDto: UpdatePostDto) {
    let tags = undefined;
    let post = undefined;
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (e) {
      console.error(e, 'Error in service update');
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }
    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException('Please check your tag ids');
    }
    try {
      post = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (e) {
      console.error(e, 'Error in service update');
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }
    if (!post) {
      throw new BadRequestException('Post does not exist');
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags;
    try {
      await this.postRepository.save(post);
    } catch (e) {
      console.error(e, 'Error in service update');
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }
    return post;
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return { deleted: true, id };
  }
}
