import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { UpdateUserDto } from "../../src/users/dto/update-user.dto";
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('PATCH /users', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    await contextService.cleanEntity(UserEntity);
  });

  it('Successfully updates user', async () => {
    const user = await contextService.createUser({ firstName: 'John', lastName: 'Doe' });
    
    const updateDto: UpdateUserDto = {
      firstName: 'Jane',
      isActive: false
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .send(updateDto)
      .expect(200);

    // Исправлено: проверяем данные внутри data
    expect(response.body.data).toMatchObject({
      ...updateDto,
      lastName: 'Doe'
    });
  });

  it('Error - duplicate name after update', async () => {
    const user1 = await contextService.createUser({ firstName: 'John', lastName: 'Doe' });
    const user2 = await contextService.createUser({ firstName: 'Jane', lastName: 'Smith' });

    const updateDto: UpdateUserDto = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user2.id}`)
      .send(updateDto)
      .expect(409);

    expect(response.body.message).toBe('Пользователь с такими именем и фамилией уже существует.');
  });
});