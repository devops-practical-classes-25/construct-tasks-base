import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ClassConstructor } from 'class-transformer';
import { CatEntity } from '../../src/cats/entities/cat.entity';
import { UserEntity } from '../../src/users/entities/user.entity';

@Injectable()
export class TestContextService {
  constructor(private readonly entityManager: EntityManager) {}

  async cleanDatabase() {
    const res = await this.entityManager.query(`
      SELECT string_agg(oid::regclass::text, ', ') table_names
      FROM pg_class
      WHERE relkind = 'r'  -- only tables
        AND relnamespace = 'public'::regnamespace
        AND oid::regclass::text != 'migrations'
      `);
    const table_names = res[0]['table_names'];
    const clean_query = `TRUNCATE TABLE ${table_names} RESTART IDENTITY CASCADE`;
    await this.entityManager.query(clean_query);
  }

  async cleanEntity(targetEntity: ClassConstructor<any>) {
    const entities =
      (await this.entityManager.connection.entityMetadatas) || [];
    const queries = entities
      .filter((entity) => entity.name === targetEntity.name)
      .map((entity) => `TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    
    await this.entityManager.query(queries[0]);
  }

  async createUser(userData: Partial<UserEntity> = {}): Promise<UserEntity> {
    const defaults = {
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      name: 'Test User',
      email: 'test@example.com',
      isActive: true
    };
  
    const user = this.entityManager.create(UserEntity, {
      ...defaults,
      ...userData
    });
    
    return this.entityManager.save(user);
  }

  async createCat(catData: Partial<CatEntity> & { ownerId?: number } = {}): Promise<CatEntity> {
    let owner: UserEntity;
    
    if (catData.ownerId) {
      const foundUser = await this.entityManager.findOneBy(UserEntity, { id: catData.ownerId });
      if (!foundUser) {
        throw new Error(`User with id=${catData.ownerId} not found`);
      }
      owner = foundUser;
    } else {
      owner = await this.createUser();
    }
  
    // Создаем кошку
    const cat = this.entityManager.create(CatEntity, {
      name: 'Tom',
      age: 1,
      breed: 'Persian',
      owner: owner,
      ...catData,
    });
  
    return this.entityManager.save(cat);
  }
}