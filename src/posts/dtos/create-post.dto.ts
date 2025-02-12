import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostTypeEnum } from '../enums/postType.enum';
import { StatusTypeEnum } from '../enums/statusType.enum';
import { CreateMetaOptionsDtos } from './create-post-meta-options.dto';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'Good day',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Type of post',
    example: 'story',
    enum: PostTypeEnum,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PostTypeEnum, {
    message: 'postType must be one of post,series,story,page',
  })
  postType: PostTypeEnum;

  @ApiProperty({
    description: 'Slug of the post',
    example: 'Basic_HTML',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    description: 'Status of post',
    example: 'review',
    enum: StatusTypeEnum,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(StatusTypeEnum, {
    message: 'status must be one of review,published,draft,scheduled',
  })
  status: StatusTypeEnum;

  @ApiPropertyOptional({
    description: 'Content of the post',
    example: 'Good day hello....',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
  content?: string;

  @ApiPropertyOptional({
    description:
      'Schema of the post.Serialize your JSON object else a validation error will be thrown',
    example: 'Schema',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Image url of post',
    example: 'https://example.com/my-post',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(200)
  @IsUrl({}, { message: 'featuredImageUrl must be a valid URL' })
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Date when the post should be published',
    example: '2025-02-10T14:00:00.000Z',
    type: 'string',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Tags related to each post',
    example: ['hi', 'jelly'],
    type: 'array',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'tags must be an array' })
  @ArrayNotEmpty({ message: 'tags cannot be empty' })
  @MinLength(3, { each: true })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Meta options related to each post',
    example: [{ key: 'sfdsf', value: 'asdf' }],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'any string identifier',
          example: 'customId',
        },
        value: {
          type: 'any',
          description: 'any value you want to store as info for key',
          example: '10',
        },
      },
    },
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMetaOptionsDtos)
  metaOptions?: CreateMetaOptionsDtos[];
}
