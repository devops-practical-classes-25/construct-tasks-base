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
    // TODO: Проверить уникальность по name, age, breed
    // Если кошка уже существует — выбросить ConflictException
    // Если нет — создать и сохранить кошку
    return await this.catRepository.save(this.catRepository.create(cat)); // временно
  }

  async findAll(): Promise<CatEntity[]> {
    // TODO: Вернуть всех кошек
    return this.catRepository.find(); // временно
  }

  async findOne(id: number): Promise<CatEntity> {
    // TODO: Найти кошку по id
    // Если не найдена — выбросить NotFoundException с нужным сообщением
    return this.catRepository.findOneBy({ id }); // временно
  }

  async remove(id: number): Promise<void> {
    // TODO: Проверить наличие кошки
    // Если не найдена — выбросить NotFoundException
    // Иначе — удалить кошку
    const cat = await this.findOne(id); // временно
    await this.catRepository.remove(cat); // временно
  }

  async update(id: number, updateDto: UpdateCatDto): Promise<CatEntity> {
    // TODO:
    // 1. Проверить, существует ли кошка с таким id
    // 2. Если имя указано — проверить, нет ли другой кошки с таким же name, age, breed
    // 3. Если конфликт — выбросить ConflictException
    // 4. Иначе — обновить кошку и вернуть обновлённый объект
    const cat = await this.findOne(id); // временно
    Object.assign(cat, updateDto); // временно
    await this.catRepository.save(cat); // временно
    return this.catRepository.findOneBy({ id }); // временно
  }
}