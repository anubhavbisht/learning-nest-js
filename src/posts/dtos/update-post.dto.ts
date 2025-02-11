import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Id of the post',
    type: 'number',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
