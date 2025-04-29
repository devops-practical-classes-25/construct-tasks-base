import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { UpdateCatDto } from "../../src/cats/dto/update-cat.dto";
import { CatEntity } from "../../src/cats/entities/cat.entity";

const testContext = createTestContext();
let app;

describe('PATCH /cats/:id', () => {
  beforeAll(async () => {
    app = testContext.app;
  });

  beforeEach(async () => {
    await testContext.contextService.cleanEntity(CatEntity);
  });

  it('Successfully updates a cat', async () => {
    const cat = await testContext.contextService.createCat();
    const dto: UpdateCatDto = { name: 'UpdatedName' };
  
    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat.id}`)
      .send(dto)
      .expect(200);
  
    expect(response.body.data).toMatchObject({
      id: cat.id,
      name: dto.name,
      age: cat.age,
    });
  });

  it('Error - duplicate name conflict', async () => {
    const cat1 = await testContext.contextService.createCat({ name: 'Vasya' });
    const cat2 = await testContext.contextService.createCat({ name: 'Murzik' });

    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat2.id}`)
      .send({ name: 'Vasya' })
      .expect(409);

    expect(response.body.message).toContain('Кошка с именем \"Vasya\" уже существует.');
  });
});