import * as dotenv from 'dotenv';
import * as path from 'path';
import { IEnvs } from 'src/typings/envs.types';

/**
 * Carrega o arquivo .env correto baseado no NODE_ENV
 * Ex:
 *  - .env.development
 *  - .env.test
 *  - .env.production
 */
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

/**
 * Helper para garantir que variáveis obrigatórias existam
 */
function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente "${name}" não foi definida`);
  }

  return value;
}

/**
 * Helper para número
 */
function getEnvNumber(name: string): number {
  return Number(getEnv(name));
}

/**
 * Configuração centralizada das variáveis de ambiente
 */
export const envs: IEnvs = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: getEnvNumber('APP_PORT'),
  },

  database: {
    host: getEnv('DB_HOST'),
    port: getEnvNumber('DB_PORT'),
    username: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    name: getEnv('DB_NAME'),
  },

  stripe: {
    publicKey: getEnv('STRIPE_PUBLIC_KEY'),
    secretKey: getEnv('STRIPE_SECRET_KEY'),
    // webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET'),
    apiVersion: process.env.STRIPE_API_VERSION || '2023-10-16',
  },
};
