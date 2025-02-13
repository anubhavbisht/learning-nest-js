import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    description:
      'Schema of the post.Serialize your JSON object else a validation error will be thrown',
    example: '"{ "sidebarEnabled": true, "footerActive": true }"',
    type: 'string',
  })
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
