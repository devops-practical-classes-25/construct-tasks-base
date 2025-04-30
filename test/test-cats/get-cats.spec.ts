import { CatEntity } from "../../src/cats/entities/cat.entity";
import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('GET /cats ', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    // Очищаем связанные сущности
    await contextService.cleanEntity(CatEntity);
    await contextService.cleanEntity(UserEntity);
  });

  describe('Read all cats', () => {
    it('No cats', async () => {
      return request(app.getHttpServer())
        .get('/cats')
        .expect(200)
        .expect({ data: [] });
    });
    
    it('One cat', async () => {
      const cat = await contextService.createCat();
      
      const response = await request(app.getHttpServer()).get('/cats');
      
      // Нормализуем данные для сравнения
      const expectedCat = {
        ...cat,
        owner: expect.objectContaining({ id: cat.owner.id })
      };
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject(expectedCat);
    });
    
    it('Two cats', async () => {
      const user = await contextService.createUser();
      const cat1 = await contextService.createCat({ ownerId: user.id });
      const cat2 = await contextService.createCat({ 
        name: 'Vasya', 
        ownerId: user.id 
      });

      const response = await request(app.getHttpServer()).get('/cats');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: cat1.id }),
          expect.objectContaining({ id: cat2.id })
        ])
      );
    });
  });

  describe('Read one cat', () => {
    it('Error - not found', async () => {
      const id = 100500;
      const response = await request(app.getHttpServer()).get(`/cats/${id}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe(`Кошка с id=${id} не найдена`);
    });
    
    it('Single cat', async () => {
      const cat = await contextService.createCat();
      
      const response = await request(app.getHttpServer()).get(`/cats/${cat.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        ...cat,
        owner: expect.objectContaining({ id: cat.owner.id })
      });
    });
    
    it('One of two cats', async () => {
      const user = await contextService.createUser();
      const cat1 = await contextService.createCat({ ownerId: user.id });
      const cat2 = await contextService.createCat({ 
        name: 'Vasya', 
        ownerId: user.id 
      });

      const response = await request(app.getHttpServer()).get(`/cats/${cat2.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        ...cat2,
        owner: expect.objectContaining({ id: user.id })
      });
    });
  });
});