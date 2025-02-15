import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    let tag = this.tagRepository.create(createTagDto);
    tag = await this.tagRepository.save(tag);
    return tag;
  }

  public async findMultipleTags(tagIds: number[]) {
    const result = this.tagRepository.find({
      where: {
        id: In(tagIds),
      },
    });
    return result;
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }

  public async softRemove(id: number) {
    await this.tagRepository.softDelete(id);

    return {
      softDeleted: true,
      id,
    };
  }
}
