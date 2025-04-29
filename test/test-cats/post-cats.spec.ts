import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { CreateCatDto } from "../../src/cats/dto/create-cat.dto";
import { CatEntity } from "../../src/cats/entities/cat.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('POST /cats', () => {
  beforeAll(async () => {
    app = testContext.app;
  });

  beforeEach(async () => {
    await testContext.contextService.cleanEntity(CatEntity);
  });

  it('Successfully creates a cat', async () => {
    const dto: CreateCatDto = { name: 'Whiskers', age: 2, breed: 'Tabby' };
    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .expect(201);

      expect(response.body.data).toMatchObject(dto);
  });

  it('Error - duplicate name', async () => {
    const dto: CreateCatDto = { name: 'Whiskers', age: 2, breed: 'Tabby' };
    await testContext.contextService.createCat(dto);

    const response = await request(app.getHttpServer())
      .post('/cats')
      .send(dto)
      .expect(409);

    expect(response.body.message).toContain('Кошка с именем \"Whiskers\" уже существует.');
  });
});