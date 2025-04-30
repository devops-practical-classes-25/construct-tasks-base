import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';
import { UpdateCatDto } from './dto/update-cat.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable() 
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,

    @InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<CatEntity> {
    // Проверка существования владельца
    const owner = await this.userRepository.findOneBy({ id: createCatDto.ownerId });
    if (!owner) {
      throw new NotFoundException(`Пользователь с id=${createCatDto.ownerId} не найден.`);
    }
  
    // Проверка уникальности имени для владельца
    const existing = await this.catRepository.findOne({
      where: {
        name: createCatDto.name,
        owner: { id: createCatDto.ownerId }
      }
    });
  
    if (existing) {
      throw new ConflictException(`Кошка с именем "${createCatDto.name}" уже существует.`); // Исправлено
    }
  
    // Создание кошки
    const newCat = this.catRepository.create({
      ...createCatDto,
      owner: owner,
    });
  
    return this.catRepository.save(newCat);
  }

  async findAll(): Promise<CatEntity[]> {
    return this.catRepository.find({ 
      relations: ['owner'],
    });
  }
  
  async findOne(id: number): Promise<CatEntity> {
    return this.catRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.catRepository.remove(cat);
  }

  async update(id: number, updateDto: UpdateCatDto): Promise<CatEntity> {
    const cat = await this.findOne(id);
  
    // Проверка нового владельца
    if (updateDto.ownerId !== undefined) {
      const owner = await this.userRepository.findOneBy({ id: updateDto.ownerId });
      if (!owner) {
        throw new NotFoundException(`Пользователь с id=${updateDto.ownerId} не найден`);
      }
      cat.owner = owner;
    }
  
    // Проверка уникальности имени для текущего владельца
    if (updateDto.name) {
      const existingCat = await this.catRepository
        .createQueryBuilder('cat')
        .where('LOWER(cat.name) = LOWER(:name)', { name: updateDto.name })
        .andWhere('cat.owner.id = :ownerId', { ownerId: cat.owner.id })
        .andWhere('cat.id != :id', { id })
        .getOne();
  
      if (existingCat) {
        throw new ConflictException(`Кошка с именем "${updateDto.name}" уже существует.`);
      }
    }
  
    // Обновление данных
    Object.assign(cat, updateDto);
    await this.catRepository.save(cat);
  
    // Возвращаем данные с владельцем
    return this.catRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }
}