import { createTestContext } from "../context/context";
import * as request from 'supertest';
import { UpdateCatDto } from "../../src/cats/dto/update-cat.dto";
import { CatEntity } from "../../src/cats/entities/cat.entity";
import { UserEntity } from "../../src/users/entities/user.entity";

const testContext = createTestContext();
let app;
let contextService;

describe('PATCH /cats/:id', () => {
  beforeAll(async () => {
    app = testContext.app;
    contextService = testContext.contextService;
  });

  beforeEach(async () => {
    await contextService.cleanEntity(CatEntity);
    await contextService.cleanEntity(UserEntity);
  });

  it('Successfully updates cat name and owner', async () => {
    const originalUser = await contextService.createUser({
      firstName: 'Oliver',
      lastName: 'Taylor'
    });
    const newUser = await contextService.createUser({
      firstName: 'Sophia',
      lastName: 'Clark'
    });
    
    const cat = await contextService.createCat({ ownerId: originalUser.id });
    const dto: UpdateCatDto = { 
      name: 'UpdatedName',
      ownerId: newUser.id
    };
  
    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat.id}`)
      .send(dto)
      .expect(200);
  
    // Проверяем только существующие поля
    expect(response.body.data).toMatchObject({
      id: cat.id,
      name: dto.name,
      owner: expect.objectContaining({ 
        id: newUser.id,
        firstName: newUser.firstName, // Проверяем firstName
        lastName: newUser.lastName     // Проверяем lastName
      })
    });
  });

  it('Error - duplicate name for same owner', async () => {
    const user = await contextService.createUser();
    const cat1 = await contextService.createCat({ 
      name: 'Vasya', 
      ownerId: user.id 
    });
    const cat2 = await contextService.createCat({ 
      name: 'Murzik', 
      ownerId: user.id 
    });

    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat2.id}`)
      .send({ name: 'Vasya' })
      .expect(409);

    expect(response.body.message).toBe('Кошка с именем "Vasya" уже существует.');
  });

  it('Success - same name for different owners', async () => {
    const user1 = await contextService.createUser();
    const user2 = await contextService.createUser();
    const cat1 = await contextService.createCat({ 
      name: 'Vasya', 
      ownerId: user1.id 
    });
    const cat2 = await contextService.createCat({ 
      name: 'Murzik', 
      ownerId: user2.id 
    });

    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat2.id}`)
      .send({ name: 'Vasya' })
      .expect(200);

    expect(response.body.data).toMatchObject({
      name: 'Vasya',
      owner: expect.objectContaining({ id: user2.id })
    });
  });

  it('Error - new owner not found', async () => {
    const user = await contextService.createUser();
    const cat = await contextService.createCat({ ownerId: user.id });

    const dto: UpdateCatDto = { 
      ownerId: 999
    };

    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat.id}`)
      .send(dto)
      .expect(404);

    expect(response.body.message).toContain('Пользователь с id=999 не найден');
  });

  it('Updates only age field', async () => {
    const user = await contextService.createUser({
      firstName: 'Test',
      lastName: 'User'
    });
    const cat = await contextService.createCat({ ownerId: user.id });
    
    const dto: UpdateCatDto = { age: 5 };
  
    const response = await request(app.getHttpServer())
      .patch(`/cats/${cat.id}`)
      .send(dto)
      .expect(200);
  
    expect(response.body.data).toMatchObject({
      id: cat.id,
      name: cat.name,
      age: dto.age,
      owner: expect.objectContaining({ 
        id: user.id,
        firstName: user.firstName, // Проверяем firstName
        lastName: user.lastName    // Проверяем lastName
      })
    });
  });
});