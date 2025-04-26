import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CatEntity } from '../../cats/entities/cat.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CatEntity, (cat) => cat.owner)
  cats: CatEntity[];
}