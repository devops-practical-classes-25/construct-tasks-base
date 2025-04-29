import { DataSource } from "typeorm";
import { config } from "../src/config"

module.exports = async function () {
  const mainDataSource = new DataSource({
    type: 'postgres',
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    username: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DB,
  });
  await mainDataSource.initialize();
  const queryRunner = mainDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(`DROP DATABASE IF EXISTS ${config.TEST_DB};`);
  await queryRunner.query(`CREATE DATABASE ${config.TEST_DB};`);
  await mainDataSource.destroy();
}