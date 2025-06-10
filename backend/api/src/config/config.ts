import dotenv from 'dotenv';
import { EnvVars } from '../types/EnvVars';
import { getEnvVar } from '../utils/getEnvVar';

dotenv.config();

// Parse and validate environment variables
const env: EnvVars = {
  APP_PORT: getEnvVar('APP_PORT', '3000'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development') as EnvVars['NODE_ENV'],
  DB_USER: getEnvVar('DB_USER', 'user'),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', 'password'),
  DB_NAME_AUTH: getEnvVar('DB_NAME_AUTH', 'database'),
  DB_NAME: getEnvVar('DB_NAME', 'database'),
  DB_PORT: getEnvVar('DB_PORT', '5432'),
  DB_HOST: getEnvVar('DB_HOST', 'localhost'),
  TOKEN_KEY: getEnvVar('TOKEN_KEY', 'secret_key'),
};


export const config = {
  appPort: Number(env.APP_PORT),
  nodeEnv: env.NODE_ENV,
  dbUser: env.DB_USER,
  dbPassword: env.DB_PASSWORD,
  dbName: env.DB_NAME,
  dbNameAuth: env.DB_NAME_AUTH,
  dbPort: Number(env.DB_PORT),
  dbHost: env.DB_HOST,
  tokenKey: env.TOKEN_KEY,
};

export type Config = typeof config;