import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { GetPostDto } from './dtos/get-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(public readonly postsService: PostsService) {}

  @Get()
  public getPosts(@Query() postsQuery: GetPostDto) {
    return this.postsService.findAll(postsQuery);
  }

  @ApiOperation({
    summary: 'Creates a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if post is created successfully',
    type: 'string',
  })
  @Post()
  public createPosts(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @ApiOperation({
    summary: 'Updates an existing post',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if post is updated successfully',
    type: 'string',
  })
  @Patch()
  public updatePost(@Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto);
  }

  @ApiOperation({
    summary: 'Deletes an existing post',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if post is deleted successfully',
    type: 'string',
  })
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
