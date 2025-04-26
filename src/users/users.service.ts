import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException } from '@nestjs/common';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName
      }
    });
  
    if (existingUser) {
      throw new ConflictException('Пользователь с такими именем и фамилией уже существует');
    }
  
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с id=${id} не найден.`);
    }
    return user;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Пользователь с id=${id} не найден.`);
    }
  }

  async findCatsByUserId(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['cats'],
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с id=${id} не найден.`);
    }
    return user.cats;
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
  
    if (updateDto.firstName || updateDto.lastName) {
      const existingUser = await this.usersRepository.findOne({
        where: {
          firstName: updateDto.firstName ?? user.firstName,
          lastName: updateDto.lastName ?? user.lastName,
        },
      });
  
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Пользователь с такими именем и фамилией уже существует.');
      }
    }
  
    const updated = Object.assign(user, updateDto);
    return this.usersRepository.save(updated);
  }
}