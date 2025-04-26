import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCatDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsInt()
  readonly age?: number;

  @IsOptional()
  @IsString()
  readonly breed?: string;
}
