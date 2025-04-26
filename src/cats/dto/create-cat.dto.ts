import { IsInt, IsString } from 'class-validator';
import { Cat } from '../interfaces/cat.interface';

export class CreateCatDto implements Cat {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly age: number;

  @IsString()
  readonly breed: string;

  @IsInt()
  readonly ownerId: number;
}