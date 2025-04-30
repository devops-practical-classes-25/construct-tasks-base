import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('DELETE /users', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    await contextService.cleanEntity(UserEntity);
  });

  it('Successfully deletes user', async () => {
    const user = await contextService.createUser();

    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .expect(404);
  });

  it('Error - delete non-existent user', async () => {
    await request(app.getHttpServer())
      .delete('/users/999')
      .expect(404);
  });
});