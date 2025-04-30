import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('cats')
export class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @ManyToOne(() => UserEntity, (user) => user.cats, { nullable: false })
  owner: UserEntity;
}