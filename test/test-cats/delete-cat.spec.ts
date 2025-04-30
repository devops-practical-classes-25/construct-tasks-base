import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { CatEntity } from "../../src/cats/entities/cat.entity";
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;

describe('DELETE /cats/:id', () => {
  beforeAll(async () => {
    app = testContext.app;
  });

  beforeEach(async () => {
    // Очищаем связанные сущности
    await testContext.contextService.cleanEntity(CatEntity);
    await testContext.contextService.cleanEntity(UserEntity);
  });

  it('Successfully deletes a cat', async () => {
    // Создаём пользователя и кошку
    const user = await testContext.contextService.createUser({
      firstName: 'Alice',
      lastName: 'Smith'
    });
    const cat = await testContext.contextService.createCat({ ownerId: user.id });

    // Удаляем кошку
    await request(app.getHttpServer())
      .delete(`/cats/${cat.id}`)
      .expect(204);

    // Проверяем, что кошка удалена
    const response = await request(app.getHttpServer())
      .get(`/cats/${cat.id}`)
      .expect(404);

    expect(response.body.message).toContain(`Кошка с id=${cat.id} не найдена`);
  });

  it('Error - cat not found', async () => {
    const response = await request(app.getHttpServer())
      .delete('/cats/999')
      .expect(404);

    expect(response.body.message).toBe(`Кошка с id=999 не найдена`);
  });
});