import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatEntity, UserEntity])
  ],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
