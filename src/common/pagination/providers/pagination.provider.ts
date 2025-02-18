import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginateQuery } from '../interfaces/paginateQuery.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<Entity extends ObjectLiteral>(
    paginateQueryDto: PaginationQueryDto,
    repository: Repository<Entity>,
  ): Promise<PaginateQuery<Entity>> {
    const result = await repository.find({
      take: paginateQueryDto.limit,
      skip: (paginateQueryDto.page - 1) * paginateQueryDto.limit,
    });
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginateQueryDto.limit);
    const nextPage =
      paginateQueryDto.page === totalPages
        ? paginateQueryDto.page
        : paginateQueryDto.page + 1;
    const previousPage =
      paginateQueryDto.page === 1
        ? paginateQueryDto.page
        : paginateQueryDto.page - 1;

    const finalResponse: PaginateQuery<Entity> = {
      data: result,
      meta: {
        itemsPerPage: paginateQueryDto.limit,
        totalItems: totalItems,
        currentPage: paginateQueryDto.page,
        totalPages: Math.ceil(totalItems / paginateQueryDto.limit),
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQueryDto.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQueryDto.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQueryDto.limit}&page=${paginateQueryDto.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQueryDto.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQueryDto.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
