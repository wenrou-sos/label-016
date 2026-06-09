import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'journal-secret-key-2024',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
