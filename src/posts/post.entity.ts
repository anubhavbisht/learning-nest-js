import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostTypeEnum } from './enums/postType.enum';
import { StatusTypeEnum } from './enums/statusType.enum';
import { CreateMetaOptionsDtos } from './dtos/create-post-meta-options.dto';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostTypeEnum,
    default: PostTypeEnum.POST,
    nullable: false,
  })
  postType: PostTypeEnum;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: StatusTypeEnum,
    default: StatusTypeEnum.DRAFT,
    nullable: false,
  })
  status: StatusTypeEnum;

  @Column({
    type: 'text',
    length: 500,
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    length: 200,
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  tags?: string[];

  metaOptions?: CreateMetaOptionsDtos[];
}
