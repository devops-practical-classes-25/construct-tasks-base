import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { CreateCatDto } from "../../src/cats/dto/create-cat.dto";
import { CatEntity } from "../../src/cats/entities/cat.entity";
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('POST /cats', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    await contextService.cleanEntity(CatEntity);
    await contextService.cleanEntity(UserEntity);
  });

  it('Successfully creates a cat', async () => {
    const user = await contextService.createUser({
      firstName: 'John',
      lastName: 'Doe'
    });
  
    const dto: CreateCatDto = { 
      name: 'Whiskers', 
      age: 2, 
      breed: 'Tabby',
      ownerId: user.id
    };
  
    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .expect(201);
  
    expect(response.body.data).toMatchObject({
      name: dto.name,
      age: dto.age,
      breed: dto.breed,
      id: expect.any(Number),
      owner: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: true
      }
    });
  });

  it('Error - duplicate name for same owner', async () => {
    const user = await contextService.createUser();

    await contextService.createCat({
      name: 'Whiskers',
      ownerId: user.id
    });

    const dto: CreateCatDto = {
      name: 'Whiskers',
      age: 3,
      breed: 'Tabby',
      ownerId: user.id
    };

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .expect(409);

    expect(response.body.message).toBe(`Кошка с именем "${dto.name}" уже существует.`);
  });

  it('Success - same name for different owners', async () => {
    const user1 = await contextService.createUser();
    const user2 = await contextService.createUser();

    await contextService.createCat({
      name: 'Whiskers',
      ownerId: user1.id
    });

    const dto: CreateCatDto = {
      name: 'Whiskers',
      age: 2,
      breed: 'Tabby',
      ownerId: user2.id
    };

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .expect(201);

    expect(response.body.data).toMatchObject({
      name: dto.name,
      age: dto.age,
      breed: dto.breed,
      id: expect.any(Number),
      owner: {
        id: user2.id,
        firstName: user2.firstName,
        lastName: user2.lastName,
        isActive: true
      }
    });
  });

  it('Error - owner not found', async () => {
    const dto: CreateCatDto = {
      name: 'Whiskers',
      age: 2,
      breed: 'Tabby',
      ownerId: 999
    };

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .expect(404);

    expect(response.body.message).toContain('Пользователь с id=999 не найден');
  });
});