import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  async create(cat: Partial<CatEntity>): Promise<CatEntity> {
    const existing = await this.catRepository.findOneBy({ name: cat.name });
    if (existing) {
      throw new ConflictException(`Кошка с именем "${cat.name}" уже существует.`);
    }
    const newCat = this.catRepository.create(cat);
    return this.catRepository.save(newCat);
  }

  async findAll(): Promise<CatEntity[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<CatEntity> {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) {
      throw new NotFoundException(`Кошка с id=${id} не найдена.`);
    }
    return cat;
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.catRepository.remove(cat);
  }

  async update(id: number, updateDto: UpdateCatDto): Promise<CatEntity> {
    const cat = await this.findOne(id);
  
    if (updateDto.name) {
      const existingCat = await this.catRepository
        .createQueryBuilder('cat')
        .where('LOWER(cat.name) = LOWER(:name)', { name: updateDto.name })
        .andWhere('cat.id != :id', { id })
        .getOne();
  
      if (existingCat) {
        throw new ConflictException(`Кошка с именем "${updateDto.name}" уже существует.`);
      }
    }
  
    Object.assign(cat, updateDto);
    await this.catRepository.save(cat);
    
    return this.catRepository.findOneBy({ id });
  }
}