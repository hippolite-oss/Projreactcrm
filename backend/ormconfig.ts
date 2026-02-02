import { DataSource } from 'typeorm';
import { entities } from './src/entities';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // Support pour DATABASE_URL (Render) ou configuration séparée (local)
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
  port: process.env.DATABASE_URL ? undefined : (Number(process.env.DB_PORT) || 5432),
  username: process.env.DATABASE_URL ? undefined : (process.env.DB_USERNAME || 'postgres'),
  password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'admin123'),
  database: process.env.DATABASE_URL ? undefined : (process.env.DB_DATABASE || 'crm'),
  entities: entities,
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development', // Seulement en dev
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});