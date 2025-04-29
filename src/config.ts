import { bool, cleanEnv, port, str } from 'envalid';

export const config = cleanEnv(
  process.env,
  {
    ADMIN_FRONT_URL: str({ default: 'http://localhost:3000' }),
    POSTGRES_USER: str({ default: 'postgres' }),
    POSTGRES_PASSWORD: str({ default: 'postgres' }),
    POSTGRES_DB: str({ default: 'postgres' }),
    POSTGRES_HOST: str({ default: 'db' }),
    POSTGRES_PORT: port({ default: 5432 }),
    NODE_ENV: str({ default: 'development' }),
    SYNCHRONIZE_DB: bool({ default: true }),
    TEST_DB: str({ default: 'test_db' }),
  }
);