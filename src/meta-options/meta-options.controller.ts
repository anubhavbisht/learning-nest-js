import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}
  @ApiOperation({
    summary: 'Creates a new meta-option',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if meta option is created successfully',
    type: 'string',
  })
  @Post()
  public createMetaOptions(
    @Body() createMetaOptions: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionsService.createMetaOptions(createMetaOptions);
  }
}
