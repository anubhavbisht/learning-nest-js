import { MetaOption } from 'src/meta-options/meta-option.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTypeEnum } from './enums/postType.enum';
import { StatusTypeEnum } from './enums/statusType.enum';

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
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
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

  @OneToOne(() => MetaOption, { cascade: true, eager: true })
  @JoinColumn()
  metaOptions?: MetaOption;

  tags?: string[];
}
