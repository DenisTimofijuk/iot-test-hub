export interface EnvVars {
  APP_PORT: string;
  NODE_ENV: 'development' | 'production' | 'test';
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME_AUTH: string;
  DB_NAME: string;
  DB_PORT: string;
  DB_HOST: string;
  TOKEN_KEY: string;
}