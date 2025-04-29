import { INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { config } from '../../src/config';
import { TestContextService } from './context.service';
import { TestContextModule } from './context.module';
import { AppModule } from '../../src/app.module';

/**
 * контекст для request тестов
 */
class TestContext {
  app: INestApplication;

  get<Provider>(provider: Type<Provider>): Provider {
    return this.app?.get(provider);
  }

  get contextService(): TestContextService {
    return this.get(TestContextService);
  }
}

export function createTestContext(metadata: any = {}) {
  const testContext = new TestContext();
  let imports = [AppModule];
  let metadataWithoutImports = {};
  if (metadata) {
    const { imports, ...metadataWithoutImports } = metadata;
  }  

  beforeAll(async () => {
    const typeormModule = TypeOrmModule.forRoot({
        type: 'postgres',
        host: config.POSTGRES_HOST,
        port: config.POSTGRES_PORT,
        username: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        database: config.TEST_DB,
        synchronize: true,
        entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
    });

    const mod = await Test.createTestingModule({
        imports: [typeormModule, TestContextModule, ...imports],
        ...metadataWithoutImports,
      }).compile();
    testContext.app = await mod.createNestApplication().init();
    await testContext.contextService.cleanDatabase();
  });

  afterAll(async () => {
    if (testContext.app) {
      await testContext.app.close();
    }
  });

  return testContext;
}