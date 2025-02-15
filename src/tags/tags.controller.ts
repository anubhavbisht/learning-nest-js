import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Creates a new tag',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if tag is created successfully',
    type: 'string',
  })
  @Post()
  public createTags(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @ApiOperation({
    summary: 'Deletes a new tag',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if tag is deleted successfully',
    type: 'string',
  })
  @Delete()
  public delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }

  @ApiOperation({
    summary: 'soft deletes a new tag',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if tag is soft deleted successfully',
    type: 'string',
  })
  @Delete('soft-delete')
  public softDelete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }
}
