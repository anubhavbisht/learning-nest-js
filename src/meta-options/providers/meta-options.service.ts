import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOptions(createMetaOptions: CreatePostMetaOptionsDto) {
    let metaOption = this.metaOptionsRepository.create(createMetaOptions);
    metaOption = await this.metaOptionsRepository.save(metaOption);
    return metaOption;
  }
}
