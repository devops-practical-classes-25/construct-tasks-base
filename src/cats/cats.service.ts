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
    private readonly userRepository: Repository<UserEntity>, // для поиска пользователей
  ) {}

  async create(createCatDto: CreateCatDto): Promise<CatEntity> {
    const existing = await this.catRepository.findOne({
      where: {
        name: createCatDto.name,
        age: createCatDto.age,
        breed: createCatDto.breed,
      },
    });

    if (existing) {
      throw new ConflictException('Кошка с такими данными уже существует.');
    }

    const owner = await this.userRepository.findOneBy({ id: createCatDto.ownerId });
    if (!owner) {
      throw new NotFoundException(`Пользователь с id=${createCatDto.ownerId} не найден.`);
    }

    const newCat = this.catRepository.create({
      name: createCatDto.name,
      age: createCatDto.age,
      breed: createCatDto.breed,
      owner: owner, // привязываем найденного пользователя
    });

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

    if (updateDto.name || updateDto.age || updateDto.breed) {
      const existingCat = await this.catRepository.findOne({
        where: {
          name: updateDto.name ?? cat.name,
          age: updateDto.age ?? cat.age,
          breed: updateDto.breed ?? cat.breed,
        },
      });
  
      if (existingCat && existingCat.id !== id) {
        throw new ConflictException('Кошка с такими данными уже существует.');
      }
    }
  
    const updated = Object.assign(cat, updateDto);
    return this.catRepository.save(updated);
  }
}