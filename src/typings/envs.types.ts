export interface IEnvs {
  app: {
    nodeEnv: string;
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    logging: boolean;
  };
  stripe: {
    publicKey: string;
    secretKey: string;
    baseUrl: string;
    apiVersion: string;
  };
}
