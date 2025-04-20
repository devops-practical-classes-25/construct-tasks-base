import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCatSchema } from './schemas/create-cat.schema';
import { CatSchema } from './schemas/cat.schema';

@ApiTags('cats')
@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @HttpCode(201) 
  @ApiBody({ type: CreateCatSchema })
  @ApiResponse({
    status: 201,
    description: 'The cat has been successfully created.',
    type: CatSchema,
  })
  async create(@Body() createCatDto: CreateCatDto): Promise<CatSchema> {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The cats have been successfully retrieved.',
    type: CatSchema,
    isArray: true,
  })
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found cat',
    type: CatSchema,
  })
  async findOne(
    @Param('id', new ParseIntPipe())
    id: number,
  ): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204) 
  @ApiResponse({
    status: 204,
    description: 'The cat has been successfully deleted.',
  })
  async delete(
    @Param('id', new ParseIntPipe())
    id: number,
  ): Promise<void> {
    await this.catsService.remove(id);
  }
}