import { join } from 'path';
import { DataSource } from 'typeorm';
import { envs } from './envs.config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: envs.database.host,
  port: Number(envs.database.port),
  username: envs.database.username,
  password: envs.database.password,
  database: envs.database.name,

  synchronize: false,
  logging: envs.database.logging,

  entities: [join(__dirname, '/../**/*.{entity,schema}.{ts,js}')],
  migrations: [join(__dirname, '/../migrations/*.{ts,js}')],
});
