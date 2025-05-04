import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // pass
  }

  async findAll(): Promise<UserEntity[]> {
    // pass
  }

  async findOne(id: number): Promise<UserEntity> {
    // pass
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<UserEntity> {
    // pass
  }

  async remove(id: number): Promise<void> {
    // pass
  }

  async findCatsByUserId(id: number) {
    // pass
  }
}
