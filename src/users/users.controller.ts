import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiResponse,
  } from '@nestjs/swagger';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { UsersService } from './users.service';
  import { UserEntity } from './entities/user.entity';
  import { CatEntity } from '../cats/entities/cat.entity';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { ParseIntPipe as CustomParseIntPipe } from '../common/pipes/parse-int.pipe';
  import { NotFoundException, ConflictException } from '@nestjs/common/exceptions';
  
  @ApiTags('users')
  @UseGuards(RolesGuard)
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
      status: 201,
      description: 'User successfully created',
      type: UserEntity,
    })
    @ApiResponse({
      status: 409,
      description: 'Conflict - User with same name already exists',
    })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
      return this.usersService.create(createUserDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
      status: 200,
      description: 'Successfully retrieved all users',
      type: UserEntity,
      isArray: true,
    })
    async findAll(): Promise<UserEntity[]> {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({
      status: 200,
      description: 'Successfully retrieved the user',
      type: UserEntity,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(
      @Param('id', CustomParseIntPipe) id: number,
    ): Promise<UserEntity> {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update user information' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
      status: 200,
      description: 'User successfully updated',
      type: UserEntity,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Conflict - Duplicate user name' })
    async update(
      @Param('id', CustomParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
      return this.usersService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({
      status: 204,
      description: 'User successfully deleted',
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async remove(
      @Param('id', CustomParseIntPipe) id: number,
    ): Promise<void> {
      await this.usersService.remove(id);
    }
  
    @Get(':id/cats')
    @ApiOperation({ summary: "Get all user's cats" })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({
      status: 200,
      description: "Successfully retrieved user's cats",
      type: CatEntity,
      isArray: true,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findCats(
      @Param('id', CustomParseIntPipe) id: number,
    ): Promise<CatEntity[]> {
      return this.usersService.findCatsByUserId(id);
    }
  }