import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Manuscript } from '../entities/manuscript.entity';
import { Review } from '../entities/review.entity';
import { Decision } from '../entities/decision.entity';
import { ManuscriptHistory } from '../entities/manuscript-history.entity';
import { Tag } from '../entities/tag.entity';
import { Notification } from '../entities/notification.entity';

dotenv.config();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'journal_platform',
  entities: [User, Manuscript, Review, Decision, ManuscriptHistory, Tag, Notification],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: '+08:00',
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
});

export const databaseConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'journal_platform',
  entities: [User, Manuscript, Review, Decision, ManuscriptHistory, Tag, Notification],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: '+08:00',
};
