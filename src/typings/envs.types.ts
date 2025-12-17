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
  };
  stripe: {
    publicKey: string;
    secretKey: string;
    apiVersion: string;
  };
}
