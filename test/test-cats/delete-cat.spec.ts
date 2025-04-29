import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { CatEntity } from "../../src/cats/entities/cat.entity";

const testContext = createTestContext();
let app;

describe('DELETE /cats/:id', () => {
  beforeAll(async () => {
    app = testContext.app;
  });

  beforeEach(async () => {
    await testContext.contextService.cleanEntity(CatEntity);
  });

  it('Successfully deletes a cat', async () => {
    const cat = await testContext.contextService.createCat();
    
    await request(app.getHttpServer())
      .delete(`/cats/${cat.id}`)
      .expect(204);
  
    const response = await request(app.getHttpServer())
      .get(`/cats/${cat.id}`)
      .expect(404);
  
    expect(response.body.message).toContain('Кошка с id=1 не найдена.');
  });

  it('Error - cat not found', async () => {
    const response = await request(app.getHttpServer())
      .delete('/cats/999')
      .expect(404);

      expect(response.body.message).toBe(`Кошка с id=999 не найдена.`);
  });
});