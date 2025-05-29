import dotenv from 'dotenv';

dotenv.config();

interface Config {
  appPort: number;
  nodeEnv: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  dbPort: number;
  dbHost: string;
}

const config: Config = {
  appPort: Number(process.env.APP_PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUser: process.env.DB_USER || 'user',
  dbPassword: process.env.DB_PASSWORD || 'password',
  dbName: process.env.DB_NAME || 'database',
  dbPort: Number(process.env.DB_PORT) || 5432,
  dbHost: process.env.DB_HOST || 'localhost'
};

export default config;