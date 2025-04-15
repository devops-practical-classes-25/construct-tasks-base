import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  async create(cat: Partial<CatEntity>): Promise<CatEntity> {
    const newCat = this.catRepository.create(cat);
    return this.catRepository.save(newCat);
  }

  async findAll(): Promise<CatEntity[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<CatEntity> {
    return this.catRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}