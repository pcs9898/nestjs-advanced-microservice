import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const envFileName = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFileName });

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['src/apis/**/entity/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);
