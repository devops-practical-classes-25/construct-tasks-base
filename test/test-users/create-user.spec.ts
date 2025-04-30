import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { CreateUserDto } from "../../src/users/dto/create-user.dto";
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('POST /users', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    await contextService.cleanEntity(UserEntity);
  });

  it('Successfully creates a user', async () => {
    const dto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(201);

    expect(response.body.data).toMatchObject({
      ...dto,
      id: expect.any(Number),
      isActive: true
    });
  });

  it('Error - duplicate first and last name', async () => {
    await contextService.createUser({
      firstName: 'John',
      lastName: 'Doe'
    });

    const dto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(409);

    expect(response.body.message).toBe('Пользователь с такими именем и фамилией уже существует');
  });
});