import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { GetPostDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginateQuery } from 'src/common/pagination/interfaces/paginateQuery.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly paginateQueryService: PaginationProvider,
    private readonly tagsService: TagsService,
    private readonly createPostProvider: CreatePostProvider,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  public async findAll(postsQuery: GetPostDto): Promise<PaginateQuery<Post>> {
    const posts = this.paginateQueryService.paginateQuery(
      {
        limit: postsQuery.limit,
        page: postsQuery.page,
      },
      this.postRepository,
    );
    return posts;
  }

  public async createPost(
    createPostDto: CreatePostDto,
    userDetails: ActiveUserData,
  ) {
    return await this.createPostProvider.create(createPostDto, userDetails);
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
