import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('GET /users', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    await contextService.cleanEntity(UserEntity);
  });

  describe('User retrieval', () => {
    it('Successfully gets all users', async () => {
      const user1 = await contextService.createUser();
      const user2 = await contextService.createUser();

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: user1.id }),
          expect.objectContaining({ id: user2.id })
        ])
      );
    });

    it('Successfully gets user by ID', async () => {
      const user = await contextService.createUser();

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body.data).toMatchObject({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: true
      });
    });

    it('Error - user not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/999')
        .expect(404);

      expect(response.body.message).toContain('Пользователь с id=999 не найден.');
    });
  });

  describe('User cats retrieval', () => {
    it('Successfully gets user cats', async () => {
      const user = await contextService.createUser();
      const cat = await contextService.createCat({ ownerId: user.id });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/cats`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        id: cat.id,
        name: cat.name
      });
    });

    it('Error - cats for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/999/cats')
        .expect(404);
    });
  });
});