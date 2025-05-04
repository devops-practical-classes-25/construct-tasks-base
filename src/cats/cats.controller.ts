import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './interfaces/cat.interface';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCatSchema } from './schemas/create-cat.schema';
import { CatSchema } from './schemas/cat.schema';

@ApiTags('cats')
@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new cat' })
  @ApiBody({ type: CreateCatSchema })
  @ApiResponse({
    status: 201,
    description: 'The cat has been successfully created.',
    type: CatSchema,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Cat with this name already exists',
  })
  async create(@Body() createCatDto: CreateCatDto): Promise<CatSchema> {
    // TODO: Реализовать создание кошки с проверкой на уникальность
    return this.catsService.create(createCatDto); // временно
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all cats',
    type: CatSchema,
    isArray: true,
  })
  async findAll(): Promise<Cat[]> {
    // TODO: Реализовать получение всех кошек
    return this.catsService.findAll(); // временно
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cat by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Cat ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the cat',
    type: CatSchema,
  })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Cat> {
    // TODO: Реализовать поиск кошки по id с обработкой 404
    return this.catsService.findOne(id); // временно
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiParam({ name: 'id', type: Number, description: 'Cat ID' })
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted the cat',
  })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    // TODO: Реализовать удаление кошки по id с обработкой 404
    await this.catsService.remove(id); // временно
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cat information' })
  @ApiParam({ name: 'id', type: Number, description: 'Cat ID' })
  @ApiBody({ type: UpdateCatDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the cat',
    type: CatSchema,
  })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Duplicate cat name' })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    // TODO: Реализовать обновление кошки с частичной валидацией и проверкой на уникальность
    return this.catsService.update(id, updateCatDto); // временно
  }
}
